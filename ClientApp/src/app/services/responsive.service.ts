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
  public onResize$: Observable<number>;

  private _destroy$ = new Subject();
  private innerWidth: any;

  constructor(private rendererFactory2: RendererFactory2) {
    const renderer = this.rendererFactory2.createRenderer(null, null);

    this.createOnResizeObservable(renderer);

    // Subscribe ourselves so we can keep a private width for ppl to access just in case
    this.onResize$.subscribe((newWidth: number) => this.innerWidth = newWidth);
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
    ).pipe(map((event: Event, indx: number) => (event.target as Window).innerWidth)).pipe(takeUntil(this._destroy$));
  }
}
