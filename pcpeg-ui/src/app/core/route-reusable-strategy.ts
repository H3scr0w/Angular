import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

/**
 * A route strategy allowing for explicit route reuse.
 * Used as a workaround for https://github.com/angular/angular/issues/18374
 * To reuse a given route, add `data: { reuse: true }` to the route definition.
 */
@Injectable()
export class RouteReusableStrategy extends RouteReuseStrategy {
  /**
   * Determines if this route (and its subtree) should be detached to be reused later
   *
   * @param route to be detached
   */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
   * Stores the detached route.
   *
   * Storing a `null` value should erase the previously stored value.
   *
   * @param route to be stored
   * @param detachedTree the detached tree
   */
  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle | null): void {}

  /**
   * Determines if this route (and its subtree) should be reattached
   *
   * @param route to be reattached
   */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
   * Retrieves the previously stored route
   *
   * @param route to be retrieve
   */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  /**
   * Determines if a route should be reused
   *
   * @param future route
   * @param curr route
   */
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig || future.data.reuse;
  }
}
