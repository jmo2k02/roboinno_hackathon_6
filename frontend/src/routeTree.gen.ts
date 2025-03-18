/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TextImport } from './routes/text'
import { Route as RootlayoutImport } from './routes/_root_layout'
import { Route as EditIndexImport } from './routes/edit/index'
import { Route as RootlayoutIndexImport } from './routes/_root_layout/index'
import { Route as RootlayoutVoiceImport } from './routes/_root_layout/voice'
import { Route as RootlayoutEditorImport } from './routes/_root_layout/editor'

// Create/Update Routes

const TextRoute = TextImport.update({
  id: '/text',
  path: '/text',
  getParentRoute: () => rootRoute,
} as any)

const RootlayoutRoute = RootlayoutImport.update({
  id: '/_root_layout',
  getParentRoute: () => rootRoute,
} as any)

const EditIndexRoute = EditIndexImport.update({
  id: '/edit/',
  path: '/edit/',
  getParentRoute: () => rootRoute,
} as any)

const RootlayoutIndexRoute = RootlayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => RootlayoutRoute,
} as any)

const RootlayoutVoiceRoute = RootlayoutVoiceImport.update({
  id: '/voice',
  path: '/voice',
  getParentRoute: () => RootlayoutRoute,
} as any)

const RootlayoutEditorRoute = RootlayoutEditorImport.update({
  id: '/editor',
  path: '/editor',
  getParentRoute: () => RootlayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_root_layout': {
      id: '/_root_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof RootlayoutImport
      parentRoute: typeof rootRoute
    }
    '/text': {
      id: '/text'
      path: '/text'
      fullPath: '/text'
      preLoaderRoute: typeof TextImport
      parentRoute: typeof rootRoute
    }
    '/_root_layout/editor': {
      id: '/_root_layout/editor'
      path: '/editor'
      fullPath: '/editor'
      preLoaderRoute: typeof RootlayoutEditorImport
      parentRoute: typeof RootlayoutImport
    }
    '/_root_layout/voice': {
      id: '/_root_layout/voice'
      path: '/voice'
      fullPath: '/voice'
      preLoaderRoute: typeof RootlayoutVoiceImport
      parentRoute: typeof RootlayoutImport
    }
    '/_root_layout/': {
      id: '/_root_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof RootlayoutIndexImport
      parentRoute: typeof RootlayoutImport
    }
    '/edit/': {
      id: '/edit/'
      path: '/edit'
      fullPath: '/edit'
      preLoaderRoute: typeof EditIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface RootlayoutRouteChildren {
  RootlayoutEditorRoute: typeof RootlayoutEditorRoute
  RootlayoutVoiceRoute: typeof RootlayoutVoiceRoute
  RootlayoutIndexRoute: typeof RootlayoutIndexRoute
}

const RootlayoutRouteChildren: RootlayoutRouteChildren = {
  RootlayoutEditorRoute: RootlayoutEditorRoute,
  RootlayoutVoiceRoute: RootlayoutVoiceRoute,
  RootlayoutIndexRoute: RootlayoutIndexRoute,
}

const RootlayoutRouteWithChildren = RootlayoutRoute._addFileChildren(
  RootlayoutRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof RootlayoutRouteWithChildren
  '/text': typeof TextRoute
  '/editor': typeof RootlayoutEditorRoute
  '/voice': typeof RootlayoutVoiceRoute
  '/': typeof RootlayoutIndexRoute
  '/edit': typeof EditIndexRoute
}

export interface FileRoutesByTo {
  '/text': typeof TextRoute
  '/editor': typeof RootlayoutEditorRoute
  '/voice': typeof RootlayoutVoiceRoute
  '/': typeof RootlayoutIndexRoute
  '/edit': typeof EditIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_root_layout': typeof RootlayoutRouteWithChildren
  '/text': typeof TextRoute
  '/_root_layout/editor': typeof RootlayoutEditorRoute
  '/_root_layout/voice': typeof RootlayoutVoiceRoute
  '/_root_layout/': typeof RootlayoutIndexRoute
  '/edit/': typeof EditIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/text' | '/editor' | '/voice' | '/' | '/edit'
  fileRoutesByTo: FileRoutesByTo
  to: '/text' | '/editor' | '/voice' | '/' | '/edit'
  id:
    | '__root__'
    | '/_root_layout'
    | '/text'
    | '/_root_layout/editor'
    | '/_root_layout/voice'
    | '/_root_layout/'
    | '/edit/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  RootlayoutRoute: typeof RootlayoutRouteWithChildren
  TextRoute: typeof TextRoute
  EditIndexRoute: typeof EditIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  RootlayoutRoute: RootlayoutRouteWithChildren,
  TextRoute: TextRoute,
  EditIndexRoute: EditIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_root_layout",
        "/text",
        "/edit/"
      ]
    },
    "/_root_layout": {
      "filePath": "_root_layout.tsx",
      "children": [
        "/_root_layout/editor",
        "/_root_layout/voice",
        "/_root_layout/"
      ]
    },
    "/text": {
      "filePath": "text.tsx"
    },
    "/_root_layout/editor": {
      "filePath": "_root_layout/editor.tsx",
      "parent": "/_root_layout"
    },
    "/_root_layout/voice": {
      "filePath": "_root_layout/voice.tsx",
      "parent": "/_root_layout"
    },
    "/_root_layout/": {
      "filePath": "_root_layout/index.tsx",
      "parent": "/_root_layout"
    },
    "/edit/": {
      "filePath": "edit/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
