import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { IReadonlyTheme } from '@microsoft/sp-component-base';
 
import Birthday from './components/Birthday';
import { IBirthdayProps } from './components/IBirthdayProps';

export interface IBirthdayWebPartProps {
  siteURL: string;
  listName:string;
} 

export default class BirthdayWebPart extends BaseClientSideWebPart<IBirthdayWebPartProps> {
 

  public render(): void {
    const element: React.ReactElement<IBirthdayProps> = React.createElement(
      Birthday,
      {
        siteURL:this.context.pageContext.web.absoluteUrl,
        listName:this.properties.listName,
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }
  
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
 

protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: { description: "Birthday Slider Configuration" },
        groups: [
          {
            groupFields: [
              PropertyPaneTextField('listName', { label: "Data List Name" }),
            ]
          }
        ]
      }
    ]
  };
}
}
