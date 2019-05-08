package gw.solr.test1.Messaging

uses gw.plugin.messaging.MessageTransport

/**
 * Created by yasser.alnouri on 5/8/2019.
 */
class NewClaimMessageTransport  implements MessageTransport {

  override function send(message: Message, s: String) {
    print("what should I send ?????????")

  }

  override function shutdown() {

  }

  override function suspend() {

  }

  override function resume() {

  }

  override function setDestinationID(i: int) {


  }
}