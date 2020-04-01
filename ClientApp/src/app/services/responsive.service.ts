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
  public onResize$: Observable<number>;

  private _destroy$ = new Subject();
  private innerWidth: any;

  constructor(private rendererFactory2: RendererFactory2) {
    const renderer = this.rendererFactory2.createRenderer(null, null);

    this.createOnResizeObservable(renderer);

    // Subscribe ourselves so we can keep a private width for ppl to access just in case
    this.onResize$.subscribe((newWidth: number) => this.innerWidth = newWidth);

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
    this.isSideNavExpanded = !this.isSideNavExpanded;
    this.SideNavExpandedInStorage = this.isSideNavExpanded;
  }

  public toggleSideNavOpen() {
    this.isSideNavOpened = !this.isSideNavOpened;
  }

  readonly SIDE_NAV_CONTRACTED_SIZE: number = 55;
  readonly SIDE_NAV_EXPANDED_SIZE: number = 150;
  public getSideNavSize(): number {
    if(!this.isSideNavOpened) { return 0; }
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

    this.onResize$ = fromEventPattern<Event>(createResizeEventListener, () =>
      removeResizeEventListener()
    ).pipe(map((event: Event, indx: number) => (event.target as Window).innerWidth))
     .pipe(map((actualWidth: number, indx: number) => actualWidth - this.getSideNavSize()))
     .pipe(takeUntil(this._destroy$));
  }
}
