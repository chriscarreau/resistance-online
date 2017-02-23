import React from 'react';

class PageRole extends React.Component {

  render() {
    
    var RoleEnum = {
        SPY : 0,
        RESISTANCE : 1
    }
    let content = "";
    if(this.props.player.role === RoleEnum.RESISTANCE){
      content = ( <div>
                    <div>Votre rôle est:</div>
                    <div>
                      <img src="/images/Bleu.svg"/>
                    </div>
                    <div>Membre de la résistance!</div>
                  </div>);
    }else{
      content = ( <div>
                    <div>Votre rôle est:</div>
                    <div>
                      <img src="/images/Rouge.svg"/>
                    </div>
                    <div>Espion!</div>
                  </div>);
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}

PageRole.propTypes = {
  player: React.PropTypes.object.isRequired
};

export default PageRole;