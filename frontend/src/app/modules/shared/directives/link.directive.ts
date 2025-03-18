import {
    DestroyRef,
    Directive,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
  } from "@angular/core";
  import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
  import { Router, UrlTree } from "@angular/router";
  
  @Directive({
    selector: "[spLink]",
    standalone: true,
  })
  export class LinkDirective implements OnChanges {
    private router = inject(Router);
    private renderer = inject(Renderer2);
    private el = inject(ElementRef);
    private destroyRef = inject(DestroyRef);
  
    private urlTree: UrlTree = this.router.createUrlTree([]); // Initialize with an empty UrlTree

    @Input() set spLink(maybeValue: string | UrlTree | undefined) {
      const value = maybeValue ?? "";
      this.urlTree =
        typeof value === "string" ? this.router.createUrlTree([value]) : value;
      this.updateHref();
    }
  
    @Input() spLinkActive: string = "";
  
    private isAnchorElement = false;
  
    constructor() {
      const tagName = this.el.nativeElement.tagName?.toLowerCase();
      this.isAnchorElement = tagName === "a" || tagName === "area";
  
      this.router.events
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.updateClass());
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      this.updateClass();
    }
  
    private updateHref() {
      const href = this.router.serializeUrl(this.urlTree);
      this.renderer.setAttribute(this.el.nativeElement, "href", href);
    }
  
    private updateClass() {
      const isActive = this.router.isActive(this.urlTree, {
        matrixParams: "ignored",
        queryParams: "ignored",
        paths: "subset",
        fragment: "ignored",
      });
      if (isActive && typeof this.spLinkActive === "string") {
        this.renderer.addClass(this.el.nativeElement, this.spLinkActive);
      } else {
        this.renderer.removeClass(this.el.nativeElement, this.spLinkActive);
      }
    }
  
    @HostListener("click")
    onClick(): boolean {
      this.router.navigateByUrl(this.urlTree);
  
      // Return `false` for `<a>` elements to prevent default action
      // and cancel the native behavior, since the navigation is handled
      // by the Router.
      return !this.isAnchorElement;
    }
  }
  