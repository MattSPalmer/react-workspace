# Workspace

Workspace is a React component that enables versatile, composable and arbitrary
layout of your UI elements. It owes its concept and a few implementation
details to deepstream.io's [Golden Layout](//golden-layout.com), though
it functions at a lower level than Golden Layout.

## Table of Contents
* [Overview](#overview)
  * [Layout](#layout)
  * [Syntax](#syntax)
* [Roadmap](#roadmap)

## Overview

### Layout

Workspace doesn't depend on external CSS frameworks. Element dimensions are
determined recursively as a fraction of the width and height of `<Layout>`'s
parent element.

The building blocks of Workspace are the components `Layout`, `Row`, `Column`
and `Item`. Of the four, only `Layout` renders DOM elements. The others, used as
children of `Layout`, serve as a description of the layout. This is very much
like [react-router](//github.com/reactjs/react-router)'s use of JSX, which
(lovingly) hijacks the XMLish syntax to describe the nested relationship between
the URL and app state.

### Syntax

Everything is configured within the root component, `<Layout>`. It takes two
main props, `register` and `config`.

Since Workspace is designed to be compatible with state management libraries
like [Redux](//github.com/reactjs/redux), its state is serializable. The
`register` prop is a plain JS object which 'registers' your components to
Workspace. Such an object might look like this:

```js
{
  wrappers: {
    debug: DebugWrapper
  }
  sidebar: {
    top: SidebarTopSection,
    bottom: SidebarLowerSection
  },
  main: MainContent
}
```

See below:

```jsx
<Layout register={register}>
  <Column id='left-sidebar' relativeScale={0.2}>
    <Item id='top' component='sidebar.top' />
    <Item id='bottom' component='sidebar.bottom' />
  </Column>
  <Column id='main'>
    <Item id='top' component='main' />
  </Column>
</Layout>
```

### Roadmap
* Include a reference implementation for drag-and-drop support
* Redux example
