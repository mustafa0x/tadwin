import {NodeSelection} from "prosemirror-state"

function create_el(html, ops) {
    const el = document.createElement(ops ? html : 'div');
    if (ops) {
        for (const [k, v] of Object.entries(ops)) {
            if (k in el)
                el[k] = v;
            else
                el.setAttribute(k, v);
        }
    }
    else
        el.innerHTML = html;
    return ops ? el : el.firstElementChild;
}

export class DocumentOutline {
    constructor(view) {
        this.cont = create_el('<div id="document-outline"></div>');
        view.dom.parentNode.appendChild(this.cont);
        this.update(view, null);
    }

    update(view, lastState) {
        if (lastState && lastState.doc.eq(view.state.doc))
            return;
        this.cont.innerHTML = '';
        view.docView.children.forEach(n => {
            if (n.node.type.name !== 'heading')
                return;
            const el = create_el(`<a href="#" class="lvl-${n.node.attrs.level}">${n.dom.textContent}</a>`);
            el.addEventListener('click', e => {
                setTimeout(() => {
                    n.dom.scrollIntoView({behavior: 'smooth', block: 'start'});
                }, 50);
                return false;
            });
            this.cont.appendChild(el);
        });
    }

    destroy() {
        this.cont.remove();
    }
}
