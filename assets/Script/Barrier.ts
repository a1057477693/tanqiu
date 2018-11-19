// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import property = cc._decorator.property;
import GameController from "./GameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Barrier extends cc.Component {


    @property(cc.Label)
    lbScore:cc.Label=null;

    @property(Boolean)
    isBuffBall:boolean=false;

    gController:GameController;

    score: number=10;


    onLoad () {
        if (this.lbScore){
            this.setScore(this.score);
        }
        if (this.isBuffBall){
            this.lbScore.node.active=false;
        }


    }
    start(){
        if (this.lbScore){
            this.lbScore.node.rotation=-this.node.rotation;
        }

    }

    setScore(score:number){
        //score=this.getScoreRandom();
        this.score=score;
        this.lbScore.string=this.score.toString();
    }
    getScoreRandom(){
        return Math.floor(Math.random()*9+1);
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void{
          console.log("onBeginContact");
          if (this.isBuffBall){
             this.gController.addBalls(this.node.position);
             this.gController.removeBarriers(this);
          }else {
              this.setScore(this.score-1);
              this.gController.addScore();
              if (this.score==0){
                  this.gController.removeBarriers(this);
              }
          }

    }
    onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void{
        console.log("onEndContact");
    }
    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void{
        console.log("onPreSolve");
    }
    onPostSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void{
        console.log("onPostSolve");
    }

    // update (dt) {}
}
