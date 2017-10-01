cc.Class({
    extends: cc.Component,
    properties:{
        prefab:{
            default:null,
            type: cc.Prefab
        },
        pool:null,
        idx:0,
        count:0
    },
    onLoad:function(){

    },
    unuse : function () {
        var node = cc.instantiate(this.prefab);
        node.zIndex = this.idx;
        this.pool.put(node);
        return node;
    },
    reuse: function (parentNode,compontentName) {
        let node = null;
        if (this.pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            node = this.pool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            if (compontentName != 'Player') {
                this.unuse(this.idx);
                node = this.pool.get();
            }
        }
        if (node) {
            node.parent = parentNode; // 将生成的敌人加入节点树
            node.getComponent(compontentName).init(this);
        }
        return node;
    }
});