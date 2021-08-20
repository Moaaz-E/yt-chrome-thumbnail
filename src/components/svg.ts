import { IComponent } from "./IComponent";

type SVGProps = {
    className? : string,
    pathD?: string,
}

const defaultProps : SVGProps = {
    className: "",
    pathD: ""
};

export default class svg implements IComponent {
    // <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    // </svg>
    /**
     *
     */
    private readonly props : SVGProps;
    constructor(props : SVGProps = defaultProps) {
        this.props = props;
    }

    render(): Element {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", this.props.className ?? "");
        svg.setAttribute("fill", "none");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("stroke", "currentColor")

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", this.props.pathD ?? "");
        path.setAttribute("strokeLinecap", "round");
        path.setAttribute("strokeLinejoin", "round");
        path.setAttribute("strokeWidth", "{2}");

        svg.appendChild(path);
        
        return svg;
    }

}
