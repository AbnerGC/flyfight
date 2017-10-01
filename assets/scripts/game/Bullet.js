cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        bulleMoveSpeed:0,
        direction:0,
        player: {
            default: null,
            serializable: false
        },
        canvas:{
            default: null,
            serializable: false
        },
        isFire:false,
        buttleAudio:{
            default: null,
            url: cc.AudioClip
        },
    },
    
    deleteBullet: function(){
       // cc.audioEngine.play(this.buttleAudio);
        this.player.node.removeChild(this.node);
        this.isFire = false;
    },

    initBullet: function(dur){
        this.node.x = 0;
        this.node.y = this.direction*30;
    },
    fireBullet: function(){
        if(false === this.isFire){
            this.isFire = true;
            this.initBullet(); 
            this.player.node.addChild(this.node);
            var duration = this.bulleMoveSpeed;
            var targetY = this.direction * (this.canvas.height + 10);
            var fire = cc.moveBy(duration, cc.p(0,targetY));
            var cb = cc.callFunc(this.deleteBullet, this);
            this.node.runAction(cc.repeat(cc.sequence(fire,cb),1));
        }
    },
    // onCollisionEnter: function (other, self) {
    //    // console.log('cccccc');
    //     //this.node.destroy();
    // },
    // use this for initialization
    onLoad: function () {

    },

    // update: function (dt) {
    //     console.log('bullet update');
        
     
    // }
});
