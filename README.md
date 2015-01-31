EPR ![travis status](https://travis-ci.org/maxpolun/epr.svg?branch=master)
===

epr lets you use nicer require paths in your node programs. It lets you change code like this:

```js
var module1 = require('../../../modules/module1'),
    module2 = require('./another/path/module2')
```

to

```js
var module1 = require('module1'),
    module2 = require('module2')
```

## How do you install it?

```sh
npm install -g epr
```

## How do you use it?

Add an ```epr``` key to your ```package.json```:

```json
{
  "epr": {
    "module1": "lib/modules/module1"
  }
}
```

and run epr:

```sh
epr
```

epr will create symlinks in ```node_modules/``` for each attribute in your ```epr```
object. Normal node rules follow, so you can add a package.json file for each of
your directories to point to a main, or you can just use it as a shortcut:

```js
var module1 = require('module1'),
// or
    module2 = require('module1/module2')
```

to set this up for deployments, call epr in your postinstall script

## Any advice?

There are several ways you can use epr, you can link to individual modules, or
you can link to directories that contain several modules. In either case I'd
recommend linking to directories rather than specific files in either case. That
makes them easier to later split out to external packages if you want to.

So if you are linking to an individual module, at say ```lib/modules/mymodule```,
just add ```"mymodule":"lib/modules/mymodule"```. This is best if you've got some
sort of code that could be an external module, but you want to keep it internal
for whatever reason.

If you've got a directory that contains modules of a particular type, say a
"modals" directory, you can link to that by adding ```"modals": "lib/modals"```,
and can be required with something like ```require('modals/user')```

Lastly you could just link to ```lib/``` or wherever else you store most your code.

## Does it do anything else?

Sure,

* ```epr clean```: delete all symlinks that are not in package.json
* ```epr empty```: delete *all* symlinks in node_modules

## can I use it from javascript?

Sure,

```js
var epr = require('epr')
epr.entangle(process.cwd(), {module1: 'lib/module1'}) // create symlinks
epr.clean(process.cwd(), {module1: 'lib/module1'}) // same as epr clean
epr.empty(process.cwd()) // same as epr empty
```

All epr api functions can either take a standard node callback or return a promise

```js
epr.entangle(process.cwd(), {module1: 'lib/module1'}, function(err){
  if(err) {
    console.error(err)
  } else {
    console.log('success!')
  }
})

epr.entangle(process.cwd(), {module1: 'lib/module1'}.then(function(){
  console.log('success!')
}, function(err){
  console.error(err)
})
```

## I'd like to make a change

See [contributing](CONTRIBUTING.md)

## What's with the name?

EPR is a reference to the Einstein-Podolsky-Rosen thought experiment which was
the origin of the concept of entanglement in quantum mechanics, and the term
"spooky action at a distance".

## OS support

epr will definitely run under any unix, but it has not been tested under windows.
Any testing or PRs for windows support would be greatly appreciated. It has 
specifically been tested to run in heroku.
