import { trigger, transition, style, state, query, animateChild, group, animate } from '@angular/animations';

export const sideNavAnimation =
  trigger('sideNavAnimation', [
    state('expanded', style({
      width: 'var(--sidenav-expanded-width)',
    })),
    state('contracted', style({
      width: 'var(--sidenav-contracted-width)',
    })),
    transition('expanded <=> contracted', [
      // Make things nice and snappy with the bezier
      animate('300ms cubic-bezier(0.680, -0.550, 0.265, 1.550)')
    ]),
  ]);

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('SingleAccount => AccountTable', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ left: '-100%'}),
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%'}))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ]),
    transition('AccountTable => SingleAccount', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ left: '100%'}),
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '-100%'}))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ]),
  ]);