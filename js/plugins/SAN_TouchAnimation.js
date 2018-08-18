//=============================================================================
// SAN_TouchAnimation.js
//=============================================================================
// Copyright (c) 2017 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc タッチアニメーション 1.0.0
 * タッチ時にアニメーションを表示します。
 * @author サンシロ https://twitter.com/rev2nym
 * @version 1.0.0 2017/08/27 バージョンを1.0.0に更新。
 * 0.0.4 2017/08/24 背景スナップにアニメーションを写り込ませないよう修正。リファクタリング。
 * 0.0.3 2017/08/23 パラメータを外部から参照できるようメソッド追加。
 * 0.0.2 2017/08/22 パラメータをセーブデータ化。選択ウィンドウ系をタッチしたときにアニメーションが表示されない不具合を修正。リファクタリング。
 * 0.0.1 2017/08/21 試作。
 * 
 * @param AnimationID
 * @desc タッチ時に表示するアニメーションのIDです。
 * @default 1
 * 
 * @param Scale
 * @desc タッチ時に表示するアニメーションの縮尺です。100で等倍です。
 * @default 100
 * 
 * @param Opacity
 * @desc 不透明度です。255で完全不透明です。
 * @default 255
 * 
 * @param Valid
 * @desc 有効フラグです。(ON/OFF)
 * @default ON
 * 
 * @help
 * ■概要
 * タッチ時にアニメーションを表示します。
 * 表示するアニメーションはプラグインパラメータで設定します。
 * 
 * ■ゲーム実行中でのパラメータの取得
 * このプラグインのパラメータは以下のスクリプトで取得できます。
 * 
 * ・アニメーションID
 * TouchAnimationLayer.animationId();
 * 
 * ・拡大率
 * TouchAnimationLayer.scale();
 * 
 * ・不透明度
 * TouchAnimationLayer.opacity();
 * 
 * ・有効/無効
 * TouchAnimationLayer.isValid();
 * 
 * ■ゲーム実行中のパラメータの変更
 * このプラグインのパラメータをゲーム中に変更するには
 * 以下のスクリプトコマンドを実行してください。
 * 
 * ・アニメーションID
 * TouchAnimationLayer.setAnimationId(10); // アニメーションIDを10に変更
 * 
 * ・拡大率
 * TouchAnimationLayer.setScale(50); // 拡大率を50%に変更
 * 
 * ・不透明度
 * TouchAnimationLayer.setOpacity(128); // 不透明度を128に変更
 * 
 * ・有効/無効
 * TouchAnimationLayer.setValid(true);  // 有効化
 * TouchAnimationLayer.setValid(false); // 無効化
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */


var Imported = Imported || {};
Imported.SAN_TouchAnimation = true;

var Sanshiro = Sanshiro || {};
Sanshiro.TouchAnimation = Sanshiro.TouchAnimation || {};
Sanshiro.TouchAnimation.version = '1.0.0';

(function() {
'use strict';

var $pluginName = 'SAN_TouchAnimation';
var $pluginParams = PluginManager.parameters($pluginName);

// タッチアニメーションパラメータ
var $touchAnimation = {
    animationId : Number($pluginParams['AnimationID']), // アニメーションID
    scale : Number($pluginParams['Scale']), // 拡大率
    opacity : Number($pluginParams['Opacity']), // 不透明度
    valid : $pluginParams['Valid'] === 'ON' // 有効フラグ
};

//-----------------------------------------------------------------------------
// DataManager
//
// データマネージャー

// セーブファイルコンテンツの作成
var _DataManager_makeSaveContents =
    DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = _DataManager_makeSaveContents.call(this);
    contents.touchAnimation = $touchAnimation;
    return contents;
};

// セーブファイルコンテンツの展開
var _DataManager_extractSaveContents =
    DataManager.extractSaveContents
DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (!!contents.touchAnimation) {
        $touchAnimation = contents.touchAnimation;
    }
};

//-----------------------------------------------------------------------------
// TouchAnimationLayer
//
// タッチアニメーションレイヤー

function TouchAnimationLayer() {
    this.initialize.apply(this, arguments);
}

TouchAnimationLayer.prototype = Object.create(Sprite.prototype);
TouchAnimationLayer.prototype.constructor = TouchAnimationLayer;

// タッチアニメーションパラメータの初期化
TouchAnimationLayer.initParams = function() {
    this.setAnimationId(Number($pluginParams['AnimationID']));
    this.setScale(Number($pluginParams['Scale']));
    this.setOpacity(Number($pluginParams['Opacity']));
    this.setValid($pluginParams['Valid'] === 'ON');
};

// アニメーションID
TouchAnimationLayer.animationId = function() {
    return $touchAnimation.animationId;
};

// アニメーションIDの設定
TouchAnimationLayer.setAnimationId = function(animationId) {
    $touchAnimation.animationId = animationId;
};

// 拡大率
TouchAnimationLayer.scale = function() {
    return $touchAnimation.scale;
};

// 拡大率の設定
TouchAnimationLayer.setScale = function(scale) {
    $touchAnimation.scale = scale;
};

// 不透明度
TouchAnimationLayer.opacity = function() {
    return $touchAnimation.opacity;
};

// 不透明度の設定
TouchAnimationLayer.setOpacity = function(opacity) {
    $touchAnimation.opacity = opacity;
};

// タッチアニメーション有効フラグ
TouchAnimationLayer.isValid = function() {
    return $touchAnimation.valid;
};

// タッチアニメーション有効フラグの設定
TouchAnimationLayer.setValid = function(valid) {
    $touchAnimation.valid = valid;
};

// オブジェクト初期化
TouchAnimationLayer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._animationSprites = []; // アニメーション表示用スプライトリスト
    this._triggered = false; // アニメーション開始済フラグ
    this.width = Graphics.width;
    this.height = Graphics.height;
    this.x = 0;
    this.y = 0;
};

// フレーム更新
TouchAnimationLayer.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.checkStartAnimation();
    this.updateAnimationSprites();
};

// アニメーション開始確認
TouchAnimationLayer.prototype.checkStartAnimation = function() {
    if (!TouchAnimationLayer.isValid()) {
        return;
    }
    if (TouchInput.isPressed()) {
        if (!this._triggered) {
            this.startAnimation(TouchInput.x, TouchInput.y);
            this._triggered = true;
        }
    } else {
        this._triggered = false;
    }
};

// アニメーションの開始
TouchAnimationLayer.prototype.startAnimation = function(x, y) {
    var animationId = TouchAnimationLayer.animationId();
    var scale = TouchAnimationLayer.scale();
    var opacity = TouchAnimationLayer.opacity();
    var animation = $dataAnimations[animationId];
    var mirror = false;
    var delay = 0;
    var baseSprite = new Sprite();
    var animationSprite = new Sprite_Base();
    baseSprite.addChild(animationSprite);
    baseSprite.anchor.x = 0.5;
    baseSprite.anchor.y = 0.5;
    baseSprite.scale.x = scale / 100.0;
    baseSprite.scale.y = scale / 100.0;
    baseSprite.x = x;
    baseSprite.y = y;
    baseSprite.opacity = opacity;
    this.addChild(baseSprite);
    animationSprite.startAnimation(animation, mirror, delay);
    this._animationSprites.push(baseSprite);
};

// アニメーションスプライトリストの更新
TouchAnimationLayer.prototype.updateAnimationSprites = function() {
    var removedSprites = [];
    this._animationSprites.forEach(
        function(baseSprite) {
            var isAnimationPlaying = baseSprite.children.some(
                function(animationSprite){
                    return animationSprite.isAnimationPlaying();
                }
            );
            if (!isAnimationPlaying) {
                this.removeChild(baseSprite);
                removedSprites.push(baseSprite);
            }
        }, this
    );
    this._animationSprites = this._animationSprites.filter(
        function(baseSprite) {
            return removedSprites.indexOf(baseSprite) === -1;
        }
    );
};

//-----------------------------------------------------------------------------
// Scene_Base
//
// シーンベース

// アニメーションレイヤーの生成
Scene_Base.prototype.createTouchAnimationLayer = function() {
    this._touchAnimationLayer = new TouchAnimationLayer();
    this.addChild(this._touchAnimationLayer);
};

// シーンの終了
var _Scene_Base_terminate =
    Scene_Base.prototype.terminate;
Scene_Base.prototype.terminate = function() {
    if (!!this._touchAnimationLayer) {
        this._touchAnimationLayer.visible = false;
    }
    _Scene_Base_terminate.call(this);
};

//-----------------------------------------------------------------------------
// Scene_Title
//
// タイトルシーン

// 生成
var _Scene_Title_create =
    Scene_Title.prototype.create;
Scene_Title.prototype.create = function() {
    _Scene_Title_create.call(this);
    TouchAnimationLayer.initParams();
    this.createTouchAnimationLayer();
};

//-----------------------------------------------------------------------------
// Scene_Map
//
// マップシーン

// 表示オブジェクトの生成
var _Scene_Map_createDisplayObjects =
    Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    _Scene_Map_createDisplayObjects.call(this);
    this.createTouchAnimationLayer();
};

//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// メニューシーンベース

// 生成
var _Scene_MenuBase_create =
    Scene_MenuBase.prototype.create;
Scene_MenuBase.prototype.create = function() {
    _Scene_MenuBase_create.call(this);
    this.createTouchAnimationLayer();
};

//-----------------------------------------------------------------------------
// Scene_Battle
//
// バトルシーン

// 表示オブジェクトの生成
var _Scene_Battle_createDisplayObjects =
    Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function() {
    _Scene_Battle_createDisplayObjects.call(this);
    this.createTouchAnimationLayer();
};

//-----------------------------------------------------------------------------
// Scene_Gameover
//
// ゲームオーバーシーン

// 表示オブジェクトの生成
var _Scene_Gameover_create =
    Scene_Gameover.prototype.create;
Scene_Gameover.prototype.create = function() {
    _Scene_Gameover_create.call(this);
    this.createTouchAnimationLayer();
};

//-----------------------------------------------------------------------------
// window
//
// グローバル領域

// 定義クラスのグローバル領域登録
window.TouchAnimationLayer = TouchAnimationLayer;

})();