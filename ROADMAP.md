# Roadmap

## Interactive HTML Preview

_Status: Shipped at May 23, 2020 ([#2](https://github.com/smeijer/testing-playground/issues/2))_

The html preview tab should be made interactive. In such a way that one can hover elements and see the recommended query. When clicking on the link, the query should applied to the editor, like the various query buttons do.

## Update Readme.md

_Status: Shipped at May 25, 2020 ([#23](https://github.com/smeijer/testing-playground/pull/23))_

We don't have any instructions on how to get the thing started at localhost, or how to contribute. This should be made crystal clear.

_Status: Shipped at May 24, 2020 ([#14](https://github.com/smeijer/testing-playground/issues/4))_

Also, I have no idea how it works, but I know we need to use emoji-key to list contributors in the readme. Is that an automated thing?

## Add tests

_Status: In backlog ([#7](https://github.com/smeijer/testing-playground/issues/7))_

A [testing-playground.com] without tests... I don't think that should be a thing, but at this moment it is.

We should fix that, and use jest & testing-library to do it.

## Usage instructions

_Status: In backlog ([#8](https://github.com/smeijer/testing-playground/issues/8))_

Do we need some instructions on how to use the tool? I'm not sure about this yet, but if we do, it should be added to the playground itself. Not just a markdown on github.

## Embeddable

_Status: Shipped at May 28, 2020 ([#9](https://github.com/smeijer/testing-playground/issues/9))_

How awesome would it be if we had an embed-mode, so users can embed the playground in the blogs they write about testing / testing-library?

## Support User-Event

_Status: In backlog ([#10](https://github.com/smeijer/testing-playground/issues/10))_

I haven't worked out the details, but enabling users to play with [user-event]s would awesome. Perhaps together with adding support for [HTML mixed mode]?

## DevTools!

_Status: In backlog ([#11](https://github.com/smeijer/testing-playground/issues/11))_

I believe we can wrap this project into a chrome extension. That way people can use the thing on their own sites, without needing to copy / paste html fragments. How awesome would that be?!

[testing-playground.com]: https://testing-playground.com
[html mixed mode]: https://codemirror.net/mode/htmlmixed/index.html
[user-event]: https://testing-library.com/docs/ecosystem-user-event
