import React, { Component } from 'react';
import './App.css';
import './board.css'
import Square from './square';
import SelectPlayer from './selectPlayer'
import starwarsthemesong from './sounds/starwarsthemesong.mp3';
import imperialmarch from './sounds/imperialmarch.mp3';
import yodalaughing from './sounds/yodalaughing.mp3';
import lightsaberon from './sounds/lightsaberon.mp3';
import laserblast from './sounds/laserblast.mp3';
import laserblaster from './sounds/laserblaster.mp3';
import {calculateWinner} from './logic_functions.js';
import {isArrFull} from './logic_functions.js';
import {aiMove} from './logic_functions.js';


class Board extends Component {
  constructor(props){
    super(props)
    this.state = {

      squares: Array(9).fill(null), //generate Array length 9 of null values.
      player1: {selected: false, icon: null, name: null}, //object to store player1 data
      player2: {selected: false, icon: null, name: null}, //object to store player2 data.
      is1stPlayer: true, //Bool to check which player is current player
      sounds: [new Audio(starwarsthemesong), new Audio(imperialmarch), new Audio(yodalaughing)],
      effects: [new Audio(lightsaberon), new Audio(laserblast), new Audio(laserblaster)],
      ai: {on: false, firstMove: true} //AI object for ai on off and if it is firstMove
    };
  }

  squareClick = (i) => {
    let { squares, player1, player2, is1stPlayer, ai } = this.state;
    //End and return nothing if both player are not selected.
    if(!player1.selected || !player2.selected){
      return
    }
    //End and return nothing if a player has won, or current square has value
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    //If AI OFF: Assign value to squares for player 1 and player 2 alternating.
    if(!ai.on){
      squares[i] = this.state.is1stPlayer ? player1.icon : player2.icon;
      let sound = (!is1stPlayer ? this.state.effects[1] : this.state.effects[2]);
      sound.play()
      this.setState({ squares: squares, is1stPlayer: !is1stPlayer })
    }
    //If AI ON, assigns value to squares for player1 and then runs aiMove
    if(ai.on){
      squares[i] = player1.icon;
      this.state.effects[1].play()
      this.setState({squares: squares, is1stPlayer: false});
      this.aiMove(i);
    }
  }

  aiMove(i){
    let { squares, player1, player2, ai } = this.state;
    let move = aiMove(squares, player1.icon, player2.icon, i, ai.firstMove);
    console.log("in AI move...", move);
    if(!calculateWinner(squares)){
      setTimeout(() => {
        squares[move] = player2.icon;
        this.state.effects[2].play()
        this.setState({ squares: squares, ai: {on: true, firstMove: false }, is1stPlayer: true });
      }, 300);
    }
  }

  //Assigns value for players to player objects in state
  selectPlayer(obj){
    let { id, value } = obj;
    //split value of name, and add '-'
    let icon = value.split(" ").join("-");
    //create img icon path.
    let img = "./img/"+icon+".png";
    console.log("in boards.. ", id, value, icon);
    //setState for players.
    if(id === 'X'){
      console.log("in id X... ");
      this.state.effects[0].play()
      this.setState({ player1: {selected: true, icon: img, name: value} })
    }
    if(id === 'O'){
      console.log("in id O)... ");
      this.state.effects[0].play()
      this.setState({ player2: {selected: true, icon: img, name: value} })
    }
  }

  checkStatus(){
    let { squares, player1, player2, is1stPlayer } = this.state;
    //Declare status, winner, and isArrFull.
    let status = "Select your side";
    const winner = calculateWinner(squares);
    const arrFull = isArrFull(squares);
    // if both players have been selected... check status.
    if(player1.selected && player2.selected)
      if(winner){ //if winner - set status to current player name + wins
         status = (!is1stPlayer ? player1.name : player2.name)+" Wins!";
         let sound = (!is1stPlayer ? this.state.sounds[0] : this.state.sounds[1]);
         sound.play()
      } else { //set status to current player's turn
         status = (is1stPlayer ? player1.name : player2.name)+"'s Turn";
      }
      if(arrFull && !winner){ //Check if array of squares is full, and no winner exists..
        //check if Han and Greedo are playing.
        if(player1.name === "han solo" && player2.name === "greedo"){
           status = "Game is tied, but Han shot first!"
           let sound = this.state.sounds[2]
           setTimeout(()=> {sound.play();}, 150);
        } else {
           status = "Game is tied"
           let sound = this.state.sounds[2]
           setTimeout(()=> {sound.play();}, 150);
        }
      }
      return status;
  }

  //Sets state of ai to true of false
  aiStatus(status){
    console.log(status);
    this.state.effects[0].play()
    this.setState({ai: {on: status, firstMove: this.state.ai.firstMove}});
    console.log("STATE: BOARDS", this.state);
  }

  resetBoard(){ //reset state of board
    this.setState({
      squares: Array(9).fill(null),
      is1stPlayer: true,
      ai: {on: this.state.ai.on, firstMove: true}
    });
    this.state.sounds.forEach((sound) => {sound.pause()});
  }

  resetPlayers(){ //reset players, and board runs function resetPlayers in child SelectPlayer
    this.setState({
      squares: Array(9).fill(null),
      player1: {selected: false, icon: null, name: null},
      player2: {selected: false, icon: null, name: null},
      is1stPlayer: true,
    });
    this.refs.selectPlayer.resetPlayers();
    this.state.sounds.forEach((sound) => {sound.pause()});
  }

  resetAI(){ //reset AI, runs function resetAI in child SelectPlayer
    this.setState({
      ai: {on: false, firstMove: true}
    });
    this.refs.selectPlayer.resetAI();
    this.state.sounds.forEach((sound) => {sound.pause()});
  }

  render() {
    console.log("STATE Boards: ", this.state);
    let { squares, isHidden } = this.state;
    let status = this.checkStatus();
    //create grid of Square child elements
    let grid = squares.map((square, i) => {
      return (
        <Square key={i.toString()} val={squares[i]} squareClick={this.squareClick.bind(this, i)} />
      );
    })
    //isHidden flips to hide elements after selection
    return (
      <div className="status">
          {!isHidden && status}
          {!isHidden && <SelectPlayer ref="selectPlayer" selectPlayer={this.selectPlayer.bind(this)} aiStatus={this.aiStatus.bind(this)}/>}
          <span><button onClick={this.resetBoard.bind(this)}> Reset Board </button>
          <button onClick={this.resetPlayers.bind(this)}> Reset Players </button>
          <button onClick={this.resetAI.bind(this)}> Reset AI </button></span>
        <div className="container">
          <main>
            {grid}
          </main>
        </div>
      </div>
    );
  }

}

export default Board;
