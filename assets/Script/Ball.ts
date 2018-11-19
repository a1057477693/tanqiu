// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GameController from "./GameController";
import Config from "./Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    rigidBody: cc.RigidBody = null;

    gController:GameController;

    isTouchedGround:boolean=false;

    onLoad() {
        this.rigidBody= <cc.RigidBody>this.getComponent(cc.RigidBody);
    }
    update(dt:Number){
        if (this.isTouchedGround){
            this.rigidBody.active=false;
            this.rigidBody.linearVelocity=cc.Vec2.ZERO;//线速度

            let pathPos:cc.Vec2[]=[];
            pathPos.push(this.node.position);
            pathPos.push(cc.v2(320,-446));
            pathPos.push(cc.v2(320,437));
            //pathPos.push(cc.v2(119,374));
            pathPos.push(cc.v2(0,257));

            this.node.runAction(cc.sequence(
                cc.cardinalSplineTo(2,pathPos,1),
                cc.callFunc(function () {
                    //this.rigidBody.active=true;
                    this.node.group=Config.groupBallInRecyle;
                    this.gController.recyleBall();
                }.bind(this)),

            ));
            this.isTouchedGround=false;
        }
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        if (otherCollider.node.name == "ground") {

            this.isTouchedGround=true;
        }
    }

    onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {

    }

    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {

    }

    onPostSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {

    }

    // update (dt) {}
}
