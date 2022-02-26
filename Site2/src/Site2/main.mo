import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Int "mo:base/Int";


actor{
    func quicksort(arr: [var Int]){
        Array.sortInPlace(arr, Int.compare);
    };

    public func qsort(arr: [Int]): async [Int] {
        var arr1: [var Int] = Array.thaw(arr); 
        quicksort(arr1);
        return Array.freeze(arr1);
    }

}

// moc调试过程
// let a : [var Int] = [var 1, 6, 5]a;
// quicksort(a);
// let b: Int = a[2];
// Debug.print(Int.toText(b));