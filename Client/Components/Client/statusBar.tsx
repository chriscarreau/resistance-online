import { object } from 'prop-types';
import React from 'react';
import { RoleEnum } from '../../../shared/enums';
import { IPlayerProps } from './props';
import { StatusBarState } from './states';

export class StatusBar extends React.Component<IPlayerProps, StatusBarState> {
  
  constructor(props) {
    super(props);
    this.state = {
      showRole: false,
      showMenu: false
    };
  }

  toggleMenu(){
    this.setState((prevState) => ({
      showRole: prevState.showRole,
      showMenu: !prevState.showMenu
    }));
  }

  showRole(){
    this.setState((prevState) => ({
      showRole: true,
      showMenu: prevState.showMenu
    }));
    this.setState({"showRole": true});
  }

  hideRole(){
    this.setState((prevState) => ({
      showRole: false,
      showMenu: prevState.showMenu
    }));
    this.setState({"showRole": false});
  }

  quitter(){
    if(confirm("Êtes-vous sûre de vouloir quitter ? Cela arrête la partie pour tout le monde.")){
      window.localStorage.removeItem("gameOptions");
      this.context.router.push('/');
    }
  }

  render() {
    return (
      <div className="status-bar">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button onClick={this.toggleMenu.bind(this)} type="button" className="navbar-toggle collapsed" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <span className="navbar-brand">{this.props.player.playerName}</span>
            </div>

            <div className={(this.state.showMenu ? "" : "collapse ") + "navbar-collapse"} id="nav-collapse">
              <ul className="nav navbar-nav navbar-right">
                <li onClick={this.showRole.bind(this)}>Voir mon rôle</li>
                <li onClick={this.quitter.bind(this)}>Quitter la partie</li>
              </ul>
            </div>
          </div>
        </nav>
        <div onClick={this.hideRole.bind(this)} className={(this.state.showRole ? "" : "hidden") + " role-div"}>
          <img src={this.props.player.role === RoleEnum.RESISTANCE ? "/images/Bleu.svg":"/images/Rouge.svg"}/>
        </div>
      </div>
    )
  }
  static propTypes = {
    player: object.isRequired
  };
  
  static contextTypes = {
    router: object.isRequired
  };
}
