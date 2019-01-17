import React, { Component } from 'react';
import './board.css'


class SelectPlayer extends Component {
  constructor(props){
    super(props)
    this.state = {
      //Create player Objects to store player id, name (for display) and value (for img path)
      player1: {id: null, name: null, value: null},
      player2: {id: null, name: null, value: null},
      //Booleans to hide player selection after selection and show after reset.
      p1Hidden: false,
      p2Hidden: false,
      //ARRAYs of character names, for display, and img paths
      light_side: [" ", "han solo", "luke skywalker", "leia organa", "chewbacca", "yoda", "admiral ackbar", "c3p0", "ewok", "lando calrissian", "obiwan kenobi", "qui gon jinn", "r2d2"],
      dark_side: [" ", "darth vader", "emperor palpatine", "boba fett", "greedo", "darth maul", "clone trooper", "jabba the hutt", "jango fett", "storm trooper"],
      //AI Bool for on or off, ARRAY for AI options, and a Bool to hide or show AI
      aiOn: false,
      ai_ops: [" ", "On", "Off"],
      aiHidden: false
    };
  }

  //On change of player selection stores state of player object, and passes object to playerSelect function in Parent Board
  handleChange(e){
    let {id, name, value} = e.target
    console.log(e.target, "in player select.. ", id, name, value);
    if(id === "X"){
      this.setState({ player1: {id: id, name: name, value: value} });
      this.props.selectPlayer({id: id, name: name, value: value});
      this.setState({p1Hidden: !this.state.p1Hidden});
    }
    if(id === "O"){
      this.setState({ player2: {id: id, name: name, value: value} });
      this.props.selectPlayer({id: id, name: name, value: value});
      this.setState({p2Hidden: !this.state.p2Hidden})
    }
  }

  // On change stores AI state, and sends values to aiStatus function in Parent Board
  handleAI(e){
    let { value } = e.target;
    console.log(e.target, "in handleAi", value);
    //Returns true or false to aiStatus in boardJS
    if(value !== ""){
      if(value === "On"){
        this.props.aiStatus(true);
        this.setState({aiOn: true, aiHidden: !this.state.aiHidden});
      }
      if(value === "Off"){
        this.props.aiStatus(false);
        this.setState({aiOn: false, aiHidden: !this.state.aiHidden});
      }
    }
  }

  // resets state for player selection
  resetPlayers(){//resetPlayers(){
    this.setState({
        player1: {id: null, name: null, value: null},
        player2: {id: null, name: null, value: null},
        p1Hidden: false,
        p2Hidden: false,
    });
  }

  // resets state for AI selection
  resetAI(){
    this.setState({
        aiHidden: false
    });
  }

  render(){
    console.log("STATE SelectPlayer: ", this.state);
    //Assign all variables to be used.
    let {player1, player2, p1Hidden, p2Hidden, light_side, dark_side, ai_ops, aiHidden, aiOn } = this.state;
    let player1icon;
    let player2icon;
    //Checks if players have value and splits name and join with a '-'
    if(player1.value){
      player1icon = player1.value.split(" ").join("-");
    }
    if(player2.value){
      player2icon = player2.value.split(" ").join("-");
    }
    // creates an img path from player1icon and player2icon
    let img1 = "./img/"+player1icon+".png";
    let img2 = "./img/"+player2icon+".png"
    //generates the select options from array of characters light_side.
    let options_ls = light_side.map((value, i) => {
      //console.log(value, i);
      return (
        <option key={i.toString()} value={value}>{value.toUpperCase()}</option>
      )
    });
    //generates the select options from array of characters dark_side.
    let options_ds = dark_side.map((value, i) => {
      //console.log(value, i);
      return (
        <option key={i.toString()} value={value}>{value.toUpperCase()}</option>
      )
    });
    //generates the select options from array of ai options.
    let options_ai = ai_ops.map((value, i) => {
      return (
        <option key={i.toString()} value={value}>{value}</option>
        )
    });
    //Forms with select options, hide and show after selection and reset
    return(
      <div>
        {!p1Hidden && <form method="get" action="" >
          <label>LIGHT SIDE: <select id="X" name="player1" onChange={this.handleChange.bind(this)}>
            {options_ls}
          </select></label>

        </form>}{p1Hidden && <img width="7%" src={img1} alt="player icon" />}{p1Hidden && " - " + player1.value}
        {!p2Hidden && <form method="get" action="" >
          <label>DARK SIDE: <select id= "O" name="player2" onChange={this.handleChange.bind(this)}>
            {options_ds}
          </select></label>

      </form>}{p2Hidden && "  -VS-  " + player2.value + " - "} {p2Hidden&& <img width="7%" src={img2} alt="player icon" /> }
      <div>{!aiHidden && <form method="get" action="">
        <label>AI: <select name="ai" onChange={this.handleAI.bind(this)}>
          {options_ai}
          </select></label>
      </form>}{!aiHidden || (aiOn ? "  AI: ON" : "  AI: OFF") }</div>
      </div>
    );
  }

}

export default SelectPlayer;
