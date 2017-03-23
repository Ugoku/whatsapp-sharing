/**
 * WhatsApp Sharing Button
 * https://github.com/kriskbx/whatsapp-sharing/
 *
 * Copyright (c) 2015 by kriskbx
 *
 * Licensed under the MIT license.
 */

(function () {

    "use strict";
    var root = this;

    /**
     * Constructor.
     *
     * @constructor
     */
    var WASHAREBTN = function () {
        this.buttons = [];

        if (this.isMobile === true) {
            this.cntLdd(window, this.crBtn);
        }
    };

    /**
     * Is iOS / Android?
     *
     * @type {boolean}
     */
    WASHAREBTN.prototype.isMobile = (navigator.userAgent.match(/Android|iPhone/i) && !navigator.userAgent.match(/iPod|iPad/i));

    /**
     * Call a function when the content is loaded and the document is ready.
     *
     * @param win
     * @param fn
     */
    WASHAREBTN.prototype.cntLdd = function (win, fn) {
        var done = false,
            top = true,
            doc = win.document,
            root = doc.documentElement,
            add = doc.addEventListener ? "addEventListener" : "attachEvent",
            rem = doc.addEventListener ? "removeEventListener" : "detachEvent",
            pre = doc.addEventListener ? "" : "on",
            init = function (e) {
                if (e.type === "readystatechange" && doc.readyState !== "complete") {
                    return;
                }
                (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) {
                    fn.call(win, e.type || e);
                }
            },
            poll = function () {
                try {
                    root.doScroll("left");
                } catch (e) {
                    setTimeout(poll, 50);
                    return;
                }
                init("poll");
            };

        if (doc.readyState === "complete") {
            fn.call(win, "lazy");
        } else {
            if (doc.createEventObject && root.doScroll) {
                try {
                    top = !win.frameElement;
                } catch (e) {
                }
                if (top) {
                    poll();
                }
            }
            doc[add](pre + "DOMContentLoaded", init, false);
            doc[add](pre + "readystatechange", init, false);
            win[add](pre + "load", init, false);
        }
    };

    /**
     * Set attributes on the given button element and returns it.
     *
     * @param b
     * @returns {*}
     */
    WASHAREBTN.prototype.setButtonAttributes = function (b) {
        var url = b.getAttribute("data-href");
        var text = "?text=" + encodeURIComponent(b.getAttribute("data-text")) + (b.getAttribute("data-text") ? "%20" : "");

        if (url) {
            text += encodeURIComponent(url);
        } else {
            text += encodeURIComponent(document.URL);
        }

        b.setAttribute("target", "_top");
        b.setAttribute("href", b.getAttribute("href") + text);
        b.setAttribute("onclick", "window.parent." + b.getAttribute("onclick"));

        return b;
    };


    /**
     * Create WASHAREBTNS from all elements with the className wa_btn.
     */
    WASHAREBTN.prototype.crBtn = function () {
        var b = [].slice.call(document.querySelectorAll(".wa_btn"));

        for (var i = 0; i < b.length; i++) {
            root.WASHAREBTN.buttons.push(b[i]);

            b[i] = root.WASHAREBTN.setButtonAttributes(b[i]);
        }
    };

    /**
     * Instance
     */
    root.WASHAREBTN = new WASHAREBTN();

}).call(this);
