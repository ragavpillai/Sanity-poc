import { Component, OnInit,TemplateRef  } from '@angular/core';
import {Product} from './product';
const sanityClient = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url')
const toMarkdown = require('@sanity/block-content-to-markdown')
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  client: any;
  builder: any;
  products:any;
  product:any;
  serializers : any;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {
    this.client = sanityClient({
      projectId: '6cj04nc1',
      dataset: 'production',
      token: 'skPoK0ocZXg1knU86kWthHRU3yJ2JykR3JXNQsvev9BtsqvwmFrt71BLGoJ7DMEsLpjS4q0zex0UZnq01NRxMorZb13UFTUqCj2xQ1agM0g9NX9eQqCBQ052b3y8fF1H8XNyTeLlXrAuDU8H1IAPM0lRmZDeL0p7oBJejFE2ij6aQaeWUBsx', // or leave blank to be anonymous user
      useCdn: false // `false` if you want to ensure fresh data
    })

    this.builder = imageUrlBuilder(this.client)

    this.serializers = {
      types: {
        code: props => '```' + props.node.language + '\n' + props.node.code + '\n```'
      }
    }
  }

  ngOnInit() {
    const query = '*[category == "ecomm-products"]'
    const params = {}

    this.client.fetch(query, params).then(prod => {

      for (var p of prod) {
        if (p['productimage']) {
          p['productimage'] = this.buildImgURL(p['productimage']['asset']["_ref"])
        }

        p['description'] = this.toPlainText(p['description'])
      }
      this.products = prod;
    })
  }

  openModal() {
    
  }


  detailView(prod,template: TemplateRef<any>){
    this.product = prod;
    this.modalRef = this.modalService.show(template);
  }

  

  buildImgURL(imageName) {
    var url = this.builder.image(imageName)

    var finalURL = "";
    if (url.options) {
      let opt = url.options;
      let splitval = opt.source.split("-");
      let fileRef = splitval[1] + "-" + splitval[2] + "." + splitval[3];
      finalURL = opt.baseUrl + "/images/" + opt.projectId + "/" + opt.dataset + "/" + fileRef
    }

    return finalURL;
  }

  toPlainText(blocks = []) {
    return blocks
      // loop through each block
      .map(block => {
        // if it's not a text block with children, 
        // return nothing
        if (block._type !== 'block' || !block.children) {
          return ''
        }
        // loop through the children spans, and join the
        // text strings
        return block.children.map(child => child.text).join('')
      })
      // join the paragraphs leaving split by two linebreaks
      .join('\n\n')
  }

}
