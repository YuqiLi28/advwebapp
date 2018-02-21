import React, { Component } from 'react';
import './App.css';
import mySocket from "socket.io-client";
import Room from "./comp/Room.js";

class App extends Component {
  constructor(props){
      super(props);
      this.state = {
          myImg:require("./img/cat1.png"),
          myImg2:require("./img/cat2.png"),
          allusers:[],
          myId:null,
          showDisplay:false,
          stickers:[]
      }
       this.handleImage = this.handleImage.bind(this);
       this.handleDisplay = this.handleDisplay.bind(this);
  }
  componentDidMount(){
     
     this.socket = mySocket("https://advserver2.herokuapp.com/");
     
     this.socket.on("userjoined", (data)=>{
        this.setState({
            allusers:data
        });
      });
     
     this.socket.on("yourid", (data)=>{
         this.setState({
             myId:data
         });
         this.refs.thedisplay.addEventListener("mousemove", (ev)=>{
         if(this.state.myId === null){
             return false;
         }
         this.refs["u"+this.state.myId].style.left = ev.pageX + "px";
         this.refs["u"+this.state.myId].style.top = ev.pageY + "px";
         
         this.socket.emit("mymove", {
             x:ev.pageX,
             y:ev.pageY,
             id:this.state.myId,
             src:this.refs["u"+this.state.myId].src
          })
        }); 
         
        this.refs.thedisplay.addEventListener("click",(ev)=>{
          this.socket.emit("stick", {
              x:ev.pageX,
              y:ev.pageY,
              src:this.refs["u"+this.state.myId].src
          });
      })
     });
     
     this.socket.on("newsticker", (data)=>{
         this.setState({
             stickers:data
         });
     });
      
     this.socket.on("newmove", (data)=>{
         this.refs["u"+data.id].style.left = data.x + "px";
         this.refs["u"+data.id].style.top = data.y + "px";
         this.refs["u"+data.id].src = data.src;
     })
     
     
     /*this.refs.thedisplay.addEventListener("mousemove", (ev)=>{
         if(this.state.myId === null){
             return false;
         }
         this.refs["u"+this.state.myId].style.left = ev.pageX + "px";
         this.refs["u"+this.state.myId].style.top = ev.pageY + "px";
         
         this.socket.emit("mymove", {
             x:ev.pageX,
             y:ev.pageY,
             id:this.state.myId,
             src:this.refs["u"+this.state.myId].src
         })
     }); */
     
      
  }
  
  handleImage(evt){
      this.refs["u"+this.state.myId].src = evt.target.src;
  }
    
    
  handleDisplay(roomString){
      this.setState({
          showDisplay:true
      });
      
      this.socket.emit("joinroom",roomString);
  }
    
  render() {
      
    var allimgs = this.state.allusers.map((obj, i)=>{
        return (
            <img ref={"u"+obj} className="allImgs" src={this.state.myImg} height={50} key={i}/>
        )
    });
    
    var allstickers = this.state.stickers.map((obj,i)=>{
        var mystyle = {left:obj.x, top:obj.y};
        
        return(
            <img style={mystyle} key={i} src={obj.src} height={50} className="allImgs" />
        )
    })  
      
    var comp = null;
    
    if(this.state.showDisplay === false){
        comp = <Room
              handleDisplay={this.handleDisplay}
            />;
    }else{
        comp = 
    
    comp = (
        <div>
            <div ref="thedisplay" id="display">
            {allimgs}
            {allstickers}
        </div>
        <div id="controls">
            {this.state.myId}
            <img onClick={this.handleImage} src={this.state.myImg} height={50}/>
            <img onClick={this.handleImage} src={this.state.myImg2} height={50}/>
        </div>
        </div>
            )
        }
    return (
      <div className="App">
        {comp}
      </div>
    );
  }
}

export default App;
