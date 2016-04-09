var React = require('react');
$=jQuery = require('jquery');

const subscribe_key = `sub-c-e30e886c-f4ba-11e5-ba5f-0619f8945a4f`,
    publish_key  = `pub-c-2ec32538-4d6b-4839-b527-2767e0070f94`

const pubnub = PUBNUB.init({                         
    publish_key   : publish_key,
    subscribe_key : subscribe_key
});

var ChatHead = React.createClass({
	render:function(){
		return (
			<div className="message-form">
			<h1>Heading</h1>
			</div>
			);
	}
});
var ErrorDisplay = React.createClass({
	render:function(){

		return (
				<div className="error">
					<p>{this.props.error}</p>
				</div>
			);
	}
});

var ChatBody = React.createClass({
	render:function(){
		
			var messageList = this.props.data.map(function(message,index){
				return(
					<div className="items" key={index}>
					<a href="#" className="pull-left">        
			<img  className="img-thumbnail img-circle" src={message.avatar_url} />      
			        </a>
			        <div className="media-body">
			          <p><strong>Anonymous robot#{message.uid}</strong></p>
			          <p className="small"><span  className="glyphicon glyphicon-time" >{message.createdTime}</span></p>
			          <p>{message.message}</p>
			        </div>
			        </div>
					);
			});

		return (
				<div className="container" id="conHeight">
    				{messageList}       		 	
  				</div>

			);
	}
});

var ChatForm = React.createClass({
	
	handleSubmit:function(e)
	{
		e.preventDefault();
		var message = this.refs.Message.value.trim();
		var time = new Date().getTime(),
		date = new Date(time),
		datestring = date.toUTCString().slice(0, -4);
		var avatar_url = "http://robohash.org/" + this.props.user + "?set=set2&bgset=bg2&size=70x70";
		var UUID = this.props.user;
		if(!message){
			return;
		}
		this.props.onMessageSubmit({message: message,createdTime:datestring,avatar_url:avatar_url,uid:UUID});
        this.refs.Message.value='';
        return;	
	},
	
	render:function(){
			var UUID = this.props.user;
			var avatar_url = "http://robohash.org/" + this.props.user + "?set=set2&bgset=bg2&size=70x70";
		return (
				<div className="message-form" id="footer">
				<div className="container">
				<div className="row">
				<form role="form" style={{padding: 30 + 'px'}} onSubmit= {this.handleSubmit} >
				<div className="input-field col-lg-6">
				    <div className="form-group " >
				    <span className="glyphicon glyphicon-pencil"></span>
				      <input type="text" className='line-form' ref="Message" placeholder="Type your message" />
				    </div>	
				</div>
				<div className="col-sm-4">
					<button type="submit" className=" btn btn-default btn-lg"><i className="glyphicon glyphicon-send">send</i></button>
				</div>			
				</form>			   
				</div>
				<span className="chip pull-left">
          			<img className="img-circle" src={avatar_url} style={{height: 30 + 'px', width: 30 + 'px'}}/>      
   					Anonymous robot #{UUID}
				</span>
				</div>
				</div>
			);
	}
})

var Main = React.createClass({
	 sub:function(){
	 	pubnub.subscribe({
		  channel: 'hello_world',
		  message : function (message, channel) {
		  	var messages = this.state.data;
    			var newMessages = messages.concat([message]);
     		 	this.setState({data:newMessages});
   			 }.bind(this),
		    error: function (error) {
		      console.log(JSON.stringify(error));
		    }.bind(this),
 		});
	 },
	 pub:function(message){
		pubnub.publish({
    		channel: 'hello_world',        
    		message: message,
    		callback : function(m){
    			console.log(m);
    		}.bind(this)
		});
	 },

	handleMessageSubmit :function(message){
	var messages = this.state.data;
    var newMessages = messages.concat([message]);
     // this.setState({data:newMessages});
     this.pub(message);
	},

	getInitialState: function() {
    return {data: [],user:Math.floor(Math.random()*90000) + 10000,errors:''};
  },

  componentDidMount: function() {
 this.sub();
  },
 render:function(){
		return (
			<div >
				<ErrorDisplay error = {this.state.errors}/>
				<ChatBody data ={this.state.data}  />
				<ChatForm onMessageSubmit={this.handleMessageSubmit} user = {this.state.user}  />
				</div>
			);
	}
});

module.exports = Main;