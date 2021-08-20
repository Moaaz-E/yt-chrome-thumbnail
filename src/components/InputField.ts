import { IComponent } from "./IComponent";
type OnInputChange = (el : HTMLInputElement) => void;
export default class InputField implements IComponent {
    private initialValue : string;
    private OnChange : OnInputChange;
    
    constructor(onChange? : OnInputChange, initialValue? : string) {
        this.OnChange = onChange ?? ((_) => {});
        this.initialValue = initialValue ?? "";
    }

    render(): Element {
        const input = document.createElement("input");
        input.value = this.initialValue;
        input.className = "shadow appearance-none absolute right-0 font-medium text-lg border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        input.placeholder = "Search"
        input.addEventListener("change", (ev) => {
            this.OnChange(<HTMLInputElement>ev.target);
        })
        return input;
    }
}