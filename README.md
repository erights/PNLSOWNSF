# PLNSOWNSF

The awful title stands for "PrivateName-like special object with
name-side faulting".

This is an exploration towards direct support for what is often
referred to as the WeakMap model of private state. This proposal
attempts to learn from
   * the current stage 3 private state proposal using `.#`
   * various threads exploring private symbols
   * @zenparsing's old `::` proposal
   * The reification of `PrivateName` in the decorator proposal.

The main difference between the `WeakMap` we have and the
`WeakMap`-like collection we need is the separation of initialization
from assignment. The collection we need is like the `PrivateName` from
the decorators proposal, but with an explicit `init` method, rather
than having initialization happen by magic.

We shim this as [PrivateName.js](./PrivateName.js) by building it on
an encapsulated `WeakMap`. `PrivateName` is like WeakMap but with the
following differences:
   * `init(key, value)` is the only way to introduce a new key into
   the map. It throws if the key is already present, rather than
   overwriting the association.
   * `get(key)` throws if the key is not present, rather than
   returning undefined.
   * `set(key, value)` throws if the key is not present, rather than
   adding it. Thus, it can only overwrite an existing association.

However, `WeakMap` has historically been impolemented by most browsers
in a way that is almost pessimal for this usage. Although the
semantics of `PrivateName` is so similar to `WeakMap`, it should be
implemented by engines:
   * using the transposed representation (as Chakra does), so that the
   state is actually in a table hung off the key, indexed by the
   PrivateName identity.
   * collected by normal garbage collection, without an expectation
   that it is supplemented by ephemeron collection. This means that if
   a key goes away, it will take all the associated values with
   it. But if a PrivateName goes away, the values it associates with
   its keys may remain as long as those keys do.

## Modeling the current private state proposal

The correspondence with the current private state proposal is by the
following expansion:

```js
class Foo {
  #state = 8;
  constructor(x) {
    this.#state = x;
  }
  update(other) {
    this.#state = other.#state;
  }
}
```

expands to the following code, where `&#state` is a placeholder for a
mangled variable name that could not have been mentioned in the
original source.

```js
const Foo = (() => {
  const &#state = new PrivateName();
  return class Foo {
    constructor(x) {
      &#state.init(this, 8);
      &#state.set(this, x);
    }
    update(other) {
      &#state.set(this, &#state.get(other));
    }
  };
})();
```

Uses of `.#state` expand as shown above into use occurrences of the
`&#state` lexical variable, which simply refers to the closest
enclosing (therefore unshadowed) defining occurrence of this same
variable name.

The `#state` declaration and initialization expands into
  * a lexical declaration of `&#state` in a scope that includes only
  the class body. (This is approximated by the IIFE above. Nevermind
  that the extends expression should be outside that scope.)
  * a use occurrence, which is the call to `init` in the constructor,
  immediately after the super constructor returns.

Hypothesis: So far, we have merely explained the semantics of the
existing stage 3 private state proposal, without modifying either its
syntax or its semantics. Because the value of the `&#state` variable is
never made available, we have not yet provided any additional power.


## Reifying and Generalizing

Let's now take the `&#state` syntax as a placeholder for some actual
new syntax we introduce, that can be explicitly used as a lexical
variable name, in order to reify the abstraction at play in the `.#`
syntax. In other words, imagine that we allow both the before and
after syntaxes shown above to be mixed freely without changing their
meaning. We can then omit the `#state = 8;` declaration if we provide
our own enclosing `&#state` declaration.

This enables us to substitute our own `PrivateName`-like abstractions,
as long as they have the same API. This object becomes a first class
capability that can be used outside the class to access the state it
names. Any such escapage will still be lexically apparent.

```js
const s = new PrivateName();
const &#state = Object.freeze({
  __proto__: s,
  get(key) {
    console.log(`getting ${key}`);
    return s.get(key);
  }
});  

class Foo {
  constructor(x) {
    &#state.init(this, 8);  // now must be manual
    this.#state = x;
  }
  update(other) {
    this.#state = other.#state;
  }
  gimmeSpecialAccess() {
    return &#state;
  }
}

const f = new Foo(9);
f.#state = 10;
const &#access = f.gimmeSpecialAccess();
f.#access = 11;
```

## Possible Alternate Syntax

The posts at [thread
comment](https://github.com/tc39/proposal-class-fields/issues/183#issuecomment-451719147)
and [thread
comment](https://github.com/tc39/proposal-class-fields/issues/183#issuecomment-451719627)
suggest that `::` is less confusing than `.#` for these
semantics. This is true even for the existing stage 3 proposal without
any of the PLNSOWNSF enhancements.

The example above with this substitution:

```js
const s = new PrivateName();
const &::state = Object.freeze({
  __proto__: s,
  get(key) {
    console.log(`getting ${key}`);
    return s.get(key);
  }
});  

class Foo {
  constructor(x) {
    &::state.init(this, 8);  // now must be manual
    this::state = x;
  }
  update(other) {
    this::state = other::state;
  }
  gimmeSpecialAccess() {
    return &::state;
  }
}

const f = new Foo(9);
f::state = 10;
const &::access = f.gimmeSpecialAccess();
f::access = 11;
```

However, we still need something prettier than `&::`. One possibility
is to use the identifier directly as a variable name, with the touchy
implication that declaring `#state` also implicitly declares
`state`. This brings us close to @zenparsing 's original `::`
proposal.

```js
const s = new PrivateName();
const state = Object.freeze({
  __proto__: s,
  get(key) {
    console.log(`getting ${key}`);
    return s.get(key);
  }
});  

class Foo {
  constructor(x) {
    state.init(this, 8);  // now must be manual
    this::state = x;
  }
  update(other) {
    this::state = other::state;
  }
  gimmeSpecialAccess() {
    return state;
  }
}

const f = new Foo(9);
f::state = 10;
const access = f.gimmeSpecialAccess();
f::access = 11;
```

This first class nature just works across membranes:

```js
class Foo {
  ::state = 8;
  constructor(x) {
    this::state = x;
  }
  update(other) {
    this::state = other::state;
  }
  gimmeSpecialAccess() {
    return state;
  }
}

const blueF = new Foo(9);
const yellowF = membrane(blueF, ...);
const yellowState = yellowF.gimmeSpecialAccess();
yellowF::yellowState = 12;
```



## Data Binding?

This would be exactly as friendly or unfriendly to data binding as
manual use of WeakMaps for state currently are. Any data binding
approach that can keep track of state by separately wrapping a WeakMap
can instead separately wrap a PrivateName.


## Decorators

Decorators would simply use these PrivateNames as the reified
PrivateNamnes they need. We would preserve the rule that only a field
decorator gets the PrivateName for that field declaration. The class
decorator still does not get any of the PrivateNames for its fields.


## Object literals

When we declare the PrivateName manually, we then have to do the
`init` of class instances manually, because there's no syntax there
that expands to call to `init` by itself. For object literals, the
situation is reversed. There's no natural place for a syntax for
declaring a PrivateName. But the property definition is a perfect
place for syntax that expands to a call to `init`

```js
const state = new PrivateName();

const obj = Object.freeze({
  ::state: 8,
  update(other) {
    this::state = other::state;
  }
});
```

expands to

```js
const state = new PrivateName();

const obj = Object.freeze({
  update(other) {
    state.set(this, state.get(other));
  }
});
state.init(obj, 8);
```

All these mechanisms would now apply across the language uniformly,
rather than being stuck in classes alone.
