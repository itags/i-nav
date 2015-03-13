module.exports = function (window) {
    "use strict";

    require('./css/i-nav.css');

    var itagCore = require('itags.core')(window),
        itagName = 'i-nav', // <-- define your own itag-name here
        DOCUMENT = window.document,
        ITSA = window.ITSA,
        Event = ITSA.Event,
        IO = ITSA.IO,
        KEY_UP = '37',
        KEY_DOWN = '39',
        KEY_ENTER = '40',
        KEY_LEAVE = '27',
        Itag;
IO.xhrPageSupport = function() {return true;};
    if (!window.ITAGS[itagName]) {

        if (IO.xhrPageSupport()) {
            Event.before('anchorclick', function(e) {
                var url;
                e.preventDefault();
                url = e.target.getAttr('href');
                // IO.get(url).then(
                //     function(data) {
                //         window.document.documentElement.setOuterHTML(data);
                //     },
                //     function(reason) {
                //         ITSA.error(reason);
                //     }
                // );
            }, 'i-nav a');
        }

        Event.after('focus', function(e) {
            var anchorNode = e.target,
                parentNode = anchorNode.getParent(),
                element, model, containerNode, index;
console.warn('after focus');
            if (parentNode.getAttr('disabled')!=='true') {
console.warn('after focus continue');
                element = anchorNode.inside('i-nav'),
                model = element.model;
                containerNode = parentNode.getParent();
console.warn(parentNode);
console.warn(containerNode);

                index = containerNode.getAll('>span').indexOf(parentNode);
console.warn('index: '+index);
                model.items.forEach(function(item, i) {
console.warn('i: '+i);
                    item.selected = (i===index);
                });
            }
        }, 'i-nav a');


        Itag = DOCUMENT.defineItag(itagName, {
            attrs: {
                'scroll-light': 'boolean',
                'scroll-autohide': 'boolean',
                horizontal: 'boolean',
            },

            init: function() {
                var element = this,
                    designNode = element.getItagContainer(),
                    model = element.model,
                    nodes = designNode.getAll('option, hr'),
                    items = [];

                if (!model.hasKey('items')) {
                    nodes.forEach(function(node) {
                        var item, submenu;
                        if (node.getTagName()==='HR') {
                            item = {
                                separator: true
                            };
                        }
                        else {
                            item = {
                                href: node.getAttr('href'),
                                disabled: (node.getAttr('disabled')==='true'),
                                hidden: (node.getAttr('hidden')==='true'),
                                selected: (node.getAttr('selected')==='true'),
                                expanded: (node.getAttr('expanded')==='true')
                            };
    /*jshint boss:true */
                            if (submenu=node.getElement('i-nav')) {
    /*jshint boss:false */
                                item.submenu = submenu.getOuterHTML(null, true);
                                node.getAll('i-nav').removeNode();
                            }
                            item.content = node.getHTML().trim();
                        }
                        items[items.length] = item;
                    });
                    model.items = items;
                }
                element.scrollModel = {};
            },

            horizontal: true,

            render: function() {
                // set the content:
                var element = this,
                    masterCont = element.setHTML(
                        '<span>'+
                        '<span plugin-fm="true" fm-manage="a" fm-keyup="'+KEY_UP+'" fm-keydown="'+KEY_DOWN+'" fm-enter="'+KEY_ENTER+'" fm-keyleave="'+KEY_LEAVE+'" fm-noloop="true"></span>'+
                        '</span>'
                    );
                masterCont.plug('scroll', element.scrollModel);
            },

            sync: function() {
console.warn('syncing');
                var element = this,
                    menuContainerNode = element.getElement('>span >span'),
                    model = element.model,
                    scrollModel = element.scrollModel,
                    content = '';

                scrollModel['scroll-light'] = model['scroll-light'];
                scrollModel['scroll-autohide'] = model['scroll-autohide'];
                scrollModel.x = model.horizontal;
                scrollModel.y = !model.horizontal;
                model.items.forEach(function(item) {
                    if (item.separator) {
                        content += '<span class="separator"></span>';
                    }
                    else {
                        content += '<span';
                        item.expanded && (content+=' expanded="true"');
                        item.selected && (content+=' selected="true"');
                        item.disabled && (content+=' disabled="true"');
                        item.hidden && (content+=' hidden="true"');
                        content += ' class="'+(item.href ? 'menuitem' : 'heading')+'"';
                        content += '>';
                        if (item.href) {
                            content += '<a href="'+item.href+'">'+item.content+'</a>';
                        }
                        else {
                            content += item.content;
                        }
                        item.submenu && (content+=item.submenu);
                        content += '</span>';
                    }
                });
                menuContainerNode.setHTML(content);
            },

            destroy: function() {
            }
        });

        window.ITAGS[itagName] = Itag;
    }

    return window.ITAGS[itagName];
};
