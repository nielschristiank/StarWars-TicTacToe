import React, { Component } from 'react';
import './App.css';
import './board.css'
import Square from './square';
import SelectPlayer from './selectPlayer'
import starwarsthemesong from './sounds/starwarsthemesong.mp3';
import {calculateWinner} from './logic_functions.js';
import {checkMoves} from './logic_functions.js';
import {isArrFull} from './logic_functions.js';
import {aiMove} from './logic_functions.js';


class Board extends Component {
  constructor(props){
    super(props)
    this.state = {

      squares: Array(9).fill(null), //generate Array length 9 of null values.
      player1: {selected: false, icon: null, name: null}, //object to store player1 data
      player2: {selected: false, icon: null, name: null}, //object to store player2 data.
      is1stPlayer: true,
      sounds: [new Audio(starwarsthemesong)],
      ai: {on: false, firstMove: true}
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
      //Assign value to squares for player 1 and player 2 alternating.
      if(!ai.on){
        squares[i] = this.state.is1stPlayer ? player1.icon : player2.icon;
        this.setState({ squares: squares, is1stPlayer: !is1stPlayer })
      }
      //If AI on, assigns value to squares for player1 and then AI
      if(ai.on){
        squares[i] = player1.icon;
        this.setState({squares: squares, is1stPlayer: false});
        setTimeout(this.aiMove(i), 5000);
        // let move = aiMove(squares, player1.icon, player2.icon, i, ai.firstMove);
        // squares[move] = player2.icon;
        // if(!calculateWinner(squares)){
        //   this.setState({ squares: squares, ai: {on: true, firstMove: false }, is1stPlayer: true });
        // }
      }
  }

  aiMove(i){
    let { squares, player1, player2, is1stPlayer, ai } = this.state;
    let move = aiMove(squares, player1.icon, player2.icon, i, ai.firstMove);
    if(!calculateWinner(squares)){
      squares[move] = player2.icon;
      this.setState({ squares: squares, ai: {on: true, firstMove: false }, is1stPlayer: true });
    }
  }

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
      this.setState({ player1: {selected: true, icon: img, name: value} })
    }
    if(id === 'O'){
      console.log("in id O)... ");
      this.setState({ player2: {selected: true, icon: img, name: value} })
    }
  }

  checkStatus(){
    let { squares, player1, player2, is1stPlayer } = this.state;
    //Declare status, winner, and isArrFull.
    let status = "Select your side";
    let sound = this.state.sounds[0];
    const winner = calculateWinner(squares);
    const arrFull = isArrFull(squares);
    // if both players have been selected... check status.
    if(player1.selected && player2.selected)
      if(winner){ //if winner - set status to current player name + wins
         status = (!is1stPlayer ? player1.name : player2.name)+" Wins!";
         sound.play()
      } else { //set status to current player's turn
         status = (is1stPlayer ? player1.name : player2.name)+"'s Turn";
      }
      if(arrFull && !winner){ //Check if array of squares is full, and no winner exists..
        //check if Han and Greedo are playing.
        if(player1.name === "han solo" && player2.name === "greedo"){
           status = "Game is tied, but Han shot first!"
        } else {
           status = "Game is tied"
        }
      }
      return status;
  }

  //Sets state of ai to true of false
  aiStatus(status){
    console.log(status);
    this.setState({ai: {on: status, firstMove: this.state.ai.firstMove}});
    console.log("STATE: BOARDS", this.state);
  }

  reset(){ //set state back to start, and call reset on child component.
    this.setState({
      squares: Array(9).fill(null),
      player1: {selected: false, icon: null, name: null},
      player2: {selected: false, icon: null, name: null},
      is1stPlayer: true,
      ai: {on: false, firstMove: true}
    });
    this.refs.selectPlayer.reset();
    this.state.sounds[0].pause()
  }

  render() {
    console.log("STATE Boards: ", this.state);
    let { squares, player1, player2, is1stPlayer, isHidden } = this.state;
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
          <button onClick={this.reset.bind(this)}>Reset</button>
        <main>
          {grid}
        </main>
      </div>
    );
  }

}

export default Board;
