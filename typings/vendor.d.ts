/* tslint:disable */
// Put shims and extensions to installed modules and typings here

// shim uglify-js for webpack
declare module "uglify-js" {
  export interface MinifyOptions {}
}
