import React from 'react'
import Prismic from 'prismic-javascript'
import { apiEndpoint, accessToken } from '../prismic-configuration'
import SliceZone from '../components/slices/SliceZone'
import Header from '../components/Header'
import Head from 'next/head'
import DefaultLayout from '../layouts'


export default class Page extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      doc: {},
      menu: {}
    }
  }
  
  static async getInitialProps(context) {
    const { uid } = context.query;
    const req = context.req;
    const page = await this.getPage(uid, req);
    return {
      doc: page.document,
      menu: page.menu
    };
  }

  static async getPage(uid, req) {
    try {
      const API = await Prismic.getApi(apiEndpoint, {req, accessToken });
      const document = await API.getByUID('page', uid);
      const menu = await API.getSingle('menu');
      return { document, menu };
    } catch(error) {
      console.error(error);
      return error;
    }
  }
  
  render() {
    return(
      <DefaultLayout>
        <div className="page" data-wio-id={this.state.doc.id}>
          <Header menu={this.props.menu} />
          <div className="container">
            <SliceZone sliceZone={this.props.doc.data.page_content} />
          </div>
        </div>
      </DefaultLayout>
    );
  }
}