import { Component } from "./Core";
import { Append, IComponent } from "./IComponent";
import { ScopedMutable } from "./State";

type SVGProps = {
    className? : string,
    pathD?: string[],
}

const defaultProps : SVGProps = {
    className: "",
    pathD: []
};

export interface ISvgElement<T extends SVGElement, self extends Component> {
    render() : T
}


class Ele<T extends SVGElement> extends Component {
    render() : T {
        throw Error("Should only be extended")
    }
}


export class SvgPath extends Component implements ISvgElement<SVGPathElement, SvgPath> {
    private d : string
    private strokeWidth : number
    private class: string[];
    constructor(d = "", strokeWidth = 2, _class : string[] = []) {
        super()
        this.d = d
        this.strokeWidth = strokeWidth
        this.class = _class.filter((val) => {if(val != "") return val})
    }

    render() : SVGPathElement {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", this.d);
        path.setAttribute("strokeLinecap", "round");
        path.setAttribute("strokeLinejoin", "round");
        path.setAttribute("strokeWidth", `{${this.strokeWidth}}`);
        if(this.class.length > 0) {
            path.classList.add(...this.class)
        }
        return path
    }

}
export default class svg extends Component {
    // <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    // </svg>
    /**
     *
     */
    private readonly props : SVGProps;
    private elements! : SVGElement[]
    constructor(props : SVGProps = defaultProps, ...pathD : string[]) {
        super();
        this.props = {
            ...defaultProps,
            ...props
        };

        if(this.props.pathD?.length == 0) {
            this.props.pathD = [...pathD]
        }
    }

    FromElement(...elements : ISvgElement<SVGElement, Component>[]) {
        this.elements = elements.map(e => e.render())
    }

    render(): Element {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", this.props.className ?? "");
        svg.setAttribute("fill", "none");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("stroke", "currentColor")
        let paths : SVGElement[] | undefined
        paths = this.elements ? this.elements : this.props.pathD?.map((pathString) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathString ?? "");
            path.setAttribute("strokeLinecap", "round");
            path.setAttribute("strokeLinejoin", "round");
            path.setAttribute("strokeWidth", "{2}");
            return path
        })
        if(paths) {
            Append(svg)(...paths)
        }
        
        return svg;
    }

}
