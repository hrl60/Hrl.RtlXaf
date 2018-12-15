
window.onload = function () {
    //     var origHideCore = HideCore; 
    //   xafNavigation.Hide = function () {
    //    alert('44)');
    //    SetState(states.hidden);
    //}
    var self = xafNavigation;
    var states = {
        hidden: "hidden",
        inplace: "inplace",
        onTop: "onTop",
        onTopAfterShow: "onTopAfterShow"
    }
    var xafNavTogleActiveDiv = $(document.getElementById("xafNavTogleActive"));
    var xafNavTogleDiv = $(document.getElementById("xafNavTogle"));
    var xafNavTogleActiveDiv_m = $(document.getElementById("xafNavTogleActive_m"));
    var xafNavTogleDiv_m = $(document.getElementById("xafNavTogle_m"));
    var navElement = $(document.getElementById("Vertical_navigation"));
    var navContentElement = $(navElement.children()[0]);
    var toggleNavigation = $(document.getElementById("toggleNavigation"));
    var toggleNavigation_m = $(document.getElementById("toggleNavigation_m"));
    var coverElement = $("<div class=\"xafCover xafFrontLayer\"></div>");
    var maxInplaceWidth = 1000;
    var currentState;
    var showNavigationPosition;
    var stateIsManuallySet = false;
    xafNavigation.Toggle = function () {
        if (self.toggleSwitchedOn) {
            self.toggleSwitchedOn = false;
            if (self.IsVisible()) {
                self.stateIsManuallySet = true;
                self.Hide(true);
            }
            else {
                self.stateIsManuallySet = false;
                self.Show(true);
            }
        }
    }
    xafNavigation.Show = function (manuallySet) {
        if (CanBeInplace()) {
            SetState(states.inplace);
        }
        else {
            SetState(states.onTop);
        }
    }

    xafNavigation.Hide = function () {
        SetState(states.hidden);
    }
    function SetState(value) {
     
        NavScrollSetVisibleState(value);
        if (self.currentState === value) {
            return;
        }
        if (value === states.hidden) {
            HideCore();
        }
        else {
            if (value === states.inplace) {
                MakeInplace();
            }
            else {
                if (value === states.onTop) {
                    MakeOnTop();
                }
                else {
                    throw "Invalid state";
                }
            }
        }
        self.currentState = value;
    }
    function NavScrollSetVisibleState(value) {
        if (value === states.inplace) {
            navContentElement.css("overflow", 'visible');
            var navBarUL = $(navContentElement.find(".dxnbSys"));
            navBarUL.css("height", '');
            navContentElement.css("height", '');
        }
        if (value === states.onTopAfterShow) {
            navContentElement.css("overflow", 'visible');
        }
        if (value === states.onTop || (value === states.hidden && self.currentState === states.onTop)) {
            var contentHeight = GetClientHeight() - self.showNavigationPosition;
            var navBarUL = $(navContentElement.find(".dxnbSys"));
            navBarUL.css("height", contentHeight + 'px');
            navContentElement.css("height", contentHeight + 'px');
            navContentElement.css("overflow", 'hidden');
        }
    }
    function HideCore() {
        if ((maxInplaceWidth > GetClientWidth() && navElement.hasClass("xafNavHidden")) && !navElement.hasClass("xafNavVisibleManually")) {
            return;
        }
        menuRefreshedInNavController = true;
        var width = navContentElement.width();
        DevExpress.fx.animate(navElement, {
            type: 'slide',
            from: { right: 0 },
            to: { right: -width * 2 },
            complete: function () {
                SetStylesForHiddenState();
                xafNavigation.toggleSwitchedOn = true;
                UpdateElementsSize();
                RaiseAnimateComplete();
            }
        });
    }
    function SetStylesForHiddenState() {
        navElement.removeClass("xafNavVisibleManually");
        navElement.addClass("xafHidden");
        RestoreBodyScroll();
        coverElement.addClass("xafHidden");
        $("html").removeClass("xafBackLayer");
        SetNavTogleState(false);
        SetEmptyHeaderDivVisibility(false);
        RefreshMainMenu();
    }
    function MakeInplace() {
        if (maxInplaceWidth < GetClientWidth() && !coverElement.hasClass("xafHidden")) {
            return;
        }
        if (!self.IsVisible()) {
            menuRefreshedInNavController = true;
            navElement.addClass("xafNavVisibleManually");
            navElement.removeClass("xafHidden");
            coverElement.addClass("xafHidden");
            RestoreBodyScroll();
            navElement.removeClass("xafFrontLayer");
            navContentElement.css("margin-top", '');
            navContentElement.css("margin-bottom", '');
            SetNavTogleState(true);
            RefreshMainMenu();
            var width = navContentElement.width();
            DevExpress.fx.animate(navElement, {
                type: 'slide',
                from: { right: -width * 2 },
                to: { right: 0 },
                complete: function () {
                    self.toggleSwitchedOn = true;
                    UpdateElementsSize();
                    RaiseAnimateComplete();
                }
            });
        }
    }
    function MakeOnTop() {
        if (!self.IsVisible()) {
            navElement.addClass("xafNavVisibleManually");
            navElement.removeClass("xafHidden");
            HideBodyScroll();
            coverElement[0].style.top = self.showNavigationPosition + "px";
            var width = navContentElement.width();
            navContentElement.css("margin-top", '0px');
            navContentElement.css("margin-bottom", '0px');
            coverElement.removeClass("xafHidden");
            navElement.addClass("xafFrontLayer");
            navElement.scrollTop(0);
            navElement[0].style.top = self.showNavigationPosition + "px";
            DevExpress.fx.animate(navElement, {
                type: 'slide',
                from: { left: -width },
                to: { left: 0 },
                complete: function () {
                    NavScrollSetVisibleState(states.onTopAfterShow);
                    self.toggleSwitchedOn = true;
                    UpdateElementsSize();
                    RaiseAnimateComplete();
                }
            })
            SetNavTogleState(true);
            SetEmptyHeaderDivVisibility(true);
        }
    }
    function SetNavTogleState(navVisible) {
        if (navVisible) {
            xafNavTogleActiveDiv_m.removeClass("xafHidden");
            xafNavTogleActiveDiv_m.removeClass("xafNavHidden");
            xafNavTogleDiv_m.addClass("xafHidden");
            xafNavTogleDiv_m.removeClass("xafNavVisible");
            xafNavTogleActiveDiv.removeClass("xafHidden");
            xafNavTogleActiveDiv.removeClass("xafNavHidden");
            xafNavTogleDiv.addClass("xafHidden");
            xafNavTogleDiv.removeClass("xafNavVisible");
        } else {
            xafNavTogleActiveDiv_m.addClass("xafHidden");
            xafNavTogleActiveDiv_m.addClass("xafNavHidden");
            xafNavTogleDiv_m.removeClass("xafHidden");
            xafNavTogleDiv_m.removeClass("xafNavVisible");
            xafNavTogleActiveDiv.addClass("xafHidden");
            xafNavTogleActiveDiv.addClass("xafNavHidden");
            xafNavTogleDiv.removeClass("xafHidden");
            xafNavTogleDiv.removeClass("xafNavVisible");
        }
    }

    function HideBodyScroll() {
        if (ASPx.Browser.WebKitTouchUI)
            return;
        ASPx.Attr.ChangeStyleAttribute(document.documentElement, "overflow-y", "hidden");
        ASPx.Attr.ChangeStyleAttribute(document.body, "margin-right", ASPx.GetVerticalScrollBarWidth() + "px");
        $("html").addClass("xafBackLayer");
    }
    function RestoreBodyScroll() {
        if (ASPx.Browser.WebKitTouchUI)
            return;
        $("html").removeClass("xafBackLayer");
        ASPx.Attr.RestoreStyleAttribute(document.body, "margin-right");
        ASPx.Attr.ChangeStyleAttribute(document.documentElement, "overflow-y", "scroll");
    }
    function IsVerticalScrollExists() {
        var scrollIsNotHidden = ASPx.GetCurrentStyle(document.body).overflowY !== "hidden" && ASPx.GetCurrentStyle(document.documentElement).overflowY !== "hidden";
        return (scrollIsNotHidden && ASPx.GetDocumentHeight() > ASPx.GetDocumentClientHeight());
    }

    function SetEmptyHeaderDivVisibility(visible) {
        if (!ASPx.Browser.WebKitTouchUI) {
            var emptyHeaderTableDiv = document.getElementById("TestheaderTableDiv");
            var headerTableDiv = document.getElementById("headerTableDiv");
            if (visible) {
                emptyHeaderTableDiv.style.display = '';
                emptyHeaderTableDiv.style.height = headerTableDiv.clientHeight + 'px';
                emptyHeaderTableDiv.style.width = document.body.style.marginRight;
            }
            else {
                emptyHeaderTableDiv.style.display = 'none';
                emptyHeaderTableDiv.style.height = '';
                emptyHeaderTableDiv.style.width = '';
            }
        }
    }
    function CanBeInplace() {
        return $(window).width() > maxInplaceWidth;
    }

    function RaiseAnimateComplete() {
        if (typeof window.CustomEvent === "function") {
            var animateCompleteEvent = new CustomEvent("animateComplete", {
                bubbles: true,
                detail: self.currentState
            });
            navElement[0].dispatchEvent(animateCompleteEvent);
        }
    }
    function UpdateElementsSize() {
        xaf.WindowResizeController.UpdateElementsSize();
        xaf.WindowResizeController.UpdateCharts();
    }


   
  
};
