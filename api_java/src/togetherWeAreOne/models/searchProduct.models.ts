export class SearchProduct {
    name: string;
    minPrice: number;
    maxPrice: number;
    negotiable: string;
    category: string[];

    prepareSearch() {
        this.name = "%"+this.name+"%";
    }
}
