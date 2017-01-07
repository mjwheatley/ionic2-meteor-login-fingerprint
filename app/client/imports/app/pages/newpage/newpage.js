"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var angular2_meteor_1 = require('angular2-meteor');
// TODO change template path
var newpage_html_1 = require('./newpage.html');
//TODO change selector
var NewPagePage = (function (_super) {
    __extends(NewPagePage, _super);
    function NewPagePage(nav, translate) {
        _super.call(this);
        this.nav = nav;
        this.translate = translate;
    }
    NewPagePage.prototype.ngOnInit = function () {
        var _this = this;
        this.autorun(function () {
            _this.user = Meteor.user();
        });
    };
    NewPagePage = __decorate([
        core_1.Component({
            selector: 'page-newpage',
            template: newpage_html_1.default
        })
    ], NewPagePage);
    return NewPagePage;
}(angular2_meteor_1.MeteorComponent));
exports.NewPagePage = NewPagePage;
