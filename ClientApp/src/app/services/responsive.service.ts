import { Injectable, OnInit, OnDestroy, HostListener, RendererFactory2, Renderer2 } from '@angular/core';
import { interval, Subscription, Observable, fromEventPattern, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService implements OnDestroy{

  // Public accessors
  public get Width(): any { return this.innerWidth; }
  public isSideNavExpanded = true;
  public isSideNavOpened = true;
  public onResize$: Observable<[number, number]>;
  public onResizeActual$: Observable<[number, number]>;

  private _destroy$ = new Subject();
  private innerWidth: number = null;
  private oldInnerWidth: number = null;

  // Smallest size to still have sidenav always out
  private readonly smallestSize: number = 768;


  constructor(private rendererFactory2: RendererFactory2) {
    const renderer = this.rendererFactory2.createRenderer(null, null);

    this.createOnResizeObservable(renderer);

    // Subscribe ourselves so we can keep a private width for ppl to access just in case
    this.onResizeActual$.subscribe((vals: [number, number]) => {
      this.oldInnerWidth = this.innerWidth;
      this.innerWidth = vals[1];
    });

    this.isSideNavExpanded = this.SideNavExpandedInStorage;
  }

  readonly SIDE_NAVE_EXPANDED_STORAGE_TAG = "side_nav_expanded"
  private get SideNavExpandedInStorage(): boolean {
    return localStorage.getItem(this.SIDE_NAVE_EXPANDED_STORAGE_TAG) === String(true);
  }
  private set SideNavExpandedInStorage(newVal: boolean) {
    localStorage.setItem(this.SIDE_NAVE_EXPANDED_STORAGE_TAG, String(newVal));
  }

  public toggleSideNavSize() {
    this.setSideNavExpanded(!this.isSideNavExpanded);
  }

  public setSideNavExpanded(isExpand: boolean) {
    this.isSideNavExpanded = isExpand;
    this.SideNavExpandedInStorage = this.isSideNavExpanded;
  }

  public toggleSideNavOpen() {
    this.setSideNavOpen(!this.isSideNavOpened);
  }

  public setSideNavOpen(isOpen: boolean) {
    this.isSideNavOpened = isOpen;
  }

  readonly SIDE_NAV_CONTRACTED_SIZE: number = 55;
  readonly SIDE_NAV_EXPANDED_SIZE: number = 150;
  public getSideNavSize(): number {
    if(!this.isSideNavOpened || this.innerWidth < this.smallestSize) { return 0; }
    if(!this.isSideNavExpanded) { return this.SIDE_NAV_CONTRACTED_SIZE; }
    /*if(this.isSideNavExpanded)*/ return this.SIDE_NAV_EXPANDED_SIZE;
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private createOnResizeObservable(renderer: Renderer2) {
    let removeResizeEventListener: () => void;
    const createResizeEventListener = (
      handler: (e: Event) => boolean | void
    ) => {
      removeResizeEventListener = renderer.listen("window", "resize", handler);
    };

    this.onResizeActual$ = fromEventPattern<Event>(createResizeEventListener, () =>
      removeResizeEventListener()
    ).pipe(map((event: Event, indx: number) => (event.target as Window).innerWidth))
     .pipe(map((newWidth: number, indx: number) => (newWidth === this.innerWidth) ? tuple(this.oldInnerWidth, newWidth) : tuple(this.innerWidth, newWidth)))

    this.onResize$ = this.onResizeActual$
     .pipe(map((actualWidths: [number, number], indx: number) => tuple(actualWidths[0] - this.getSideNavSize(), actualWidths[1] - this.getSideNavSize())))
     .pipe(takeUntil(this._destroy$));

    this.onResizeActual$ = this.onResizeActual$.pipe(takeUntil(this._destroy$));
    this.onResize$ = this.onResize$.pipe(takeUntil(this._destroy$));
  }
}

// Taken from https://stackoverflow.com/a/54842559 to help with tuple conversion
type Narrowable = string | number | boolean | undefined | null | void | {};
const tuple = <T extends Narrowable[]>(...t: T)=> t;