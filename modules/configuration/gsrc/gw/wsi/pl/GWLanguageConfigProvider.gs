package gw.wsi.pl

uses gw.xml.ws.IWsiWebserviceConfigurationProvider
uses gw.xml.ws.WsdlConfig
uses gw.guidewire.soapheaders.GwLanguage
uses gw.guidewire.soapheaders.GwLocale
uses gw.guidewire.soapheaders.Locale

uses javax.xml.namespace.QName

@Export
class GWLanguageConfigProvider implements IWsiWebserviceConfigurationProvider {

  override function configure( serviceName : QName, portName : QName, config : WsdlConfig )  {
    var oldHeader = new Locale(gw.api.util.LocaleUtil.getCurrentLocale().getJavaLocale().toString());
    var langHeader = new GwLanguage(gw.api.util.LocaleUtil.getCurrentLanguage().Code);
    var localeHeader = new GwLocale(gw.api.util.LocaleUtil.getCurrentLocale().Code);
    config.getRequestSoapHeaders().add(oldHeader);
    config.getRequestSoapHeaders().add(langHeader);
    config.getRequestSoapHeaders().add(localeHeader);
  }

}