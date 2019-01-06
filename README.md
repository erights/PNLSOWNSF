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

We shim this as [PrivateName.js](./PrivateName.js). Note an
interesting irony in the way this shim is written. 
