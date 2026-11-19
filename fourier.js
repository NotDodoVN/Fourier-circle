function sliceWithStep(arr, start = 0, end = arr.length, step = 1){
    const result = [];
    if (step > 0) {
        for (let i = start; i < end; i += step){
            if (i < arr.length){
                result.push(arr[i]);
            }
        }
    } else {
        for (let i = start; i > end; i += step){
            if (i >= 0) result.push(arr[i]);
        }
    }
    return result;
};

function FFT (P){
    var n = length(P);
    if (n == 1){
        return P
    };
    omega = exp((2*PI* complex(0,1))/n);
    P_even = sliceWithStep(P,start = 0, end = P.length, step = 2);
    P_odd = sliceWithStep(P,start = 1, end = P.length, step = 2);

    y_e = FFT(P_even);
    y_o = FFT(P_odd);
    const y = new Array(n).fill(0);

    for (let j = 0; j < (n/2); j++){
        y[j] = y_e[j] + pow(omega, j) * y_odd[j]
        y[j + n/2] = y_e[j] - pow(omega, j) * y_odd[j]

    };
    return y 
};

// function DFT(x){
//     let X = [];
//     const N = x.length;

//     for (let k = 0; k < N; k += 1){
//         let X_k = {re : 0, im : 0, freq : 0, amp : 0, phase: 0};
//         for (let n = 0; n < N; n += 1){
//             if (typeof(x[n]) === "number"){
//                 a = x[n];
//                 b = 0;
//             } else {
//                 a = x[n].re;
//                 b = x[n].im;
//             };
//             phi = (TWO_PI *  k * n) / N;
//             let real = a * cos(phi) + b * sin(phi);
//             let imaginary = -a * sin(phi) + b * cos(phi);
            
//             X_k.re += real;
//             X_k.im += imaginary;
//         };
//         X_k.re = X_k.re / N;
//         X_k.im = X_k.im / N;

//         X_k.freq = k;
//         X_k.amp = sqrt(X_k.re*X_k.re + X_k.im*X_k.im);
//         X_k.phase = atan2(X_k.im, X_k.re);

//         X.push(X_k);
//     };
//     return X;
// };

// function IDFT(X){
//     let x = [];
//     const N = X.length;
    
//     for (let k = 0; k < N; k += 1){
//         let x_k = {re : 0, im : 0, freq : 0, amp : 0, phase: 0};
//         for (let n = 0; n < N; n += 1){
//             if (typeof(X[n]) === "number"){
//                 a = X[n];
//                 b = 0;
//             } else {
//                 a = X[n].re;
//                 b = X[n].im;
//             };
//             phi = (TWO_PI *  k * n) / N;
//             let real = a * cos(phi) - b * sin(phi);
//             let imaginary = a * sin(phi) + b * cos(phi);
            
//             x_k.re += real;
//             x_k.im += imaginary;
//         };
//         x_k.re = x_k.re / N; 
//         x_k.im = x_k.im / N; 
//         x_k.freq = k;
//         x_k.amp = sqrt( x_k.re * x_k.re + x_k.im * x_k.im);
//         x_k.phase = atan2( x_k.im, x_k.re);

//         x.push(x_k);
//     };
//     return x;
// };


// function DFT(x){
//     let X = [];
//     const N = x.length;

//     for (let k = 0; k < N; k += 1){
//         let X_k = {re : 0, im : 0};
//         for (let n = 0; n < N; n += 1){
//             if (typeof(x[n]) === "number"){
//                 a = x[n];
//                 b = 0;
//             } else {
//                 a = x[n].re;
//                 b = x[n].im;
//             };
//             phi = (TWO_PI *  k * n) / N;
//             let real = a * cos(phi) + b * sin(phi);
//             let imaginary = -a * sin(phi) + b * cos(phi);
            
//             X_k.re += real;
//             X_k.im += imaginary;
//         };
//         X_k.re = X_k.re / N;
//         X_k.im = X_k.im / N;

//         X.push(X_k);
//     };
//     return X;
// };

class Complex {
    constructor (real, img){
        this.real = real;
        this.img = img;
    }

    add(num){
        this.real += num.real;
        this.img += num.img;
    }
    multi(num){
        const real = (this.real * num.real) - (this.img * num.img);
        const img = (this.real*num.img) + (this.img*num.real);
        this.real = real;
        this.img = img;
    }
}

function DFT(x){
    let X = [];
    const N = x.length;

    for (let k = 0; k < N; k += 1){
        let X_k = new Complex(0,0);

        for (let n = 0; n < N; n += 1){
            if (typeof(x[n]) === "number"){
                a = x[n];
                b = 0;
            } else {
                a = x[n].real;
                b = x[n].img;
            };
            phi = (TWO_PI *  k * n) / N;
            let real = a * cos(phi) + b * sin(phi);
            let imaginary = -a * sin(phi) + b * cos(phi);
            
            temp_complex = new Complex(real, imaginary);
            X_k.add(temp_complex);
        };
        X_k.multi(new Complex(1/N, 0));
        freq = k;
        radius = sqrt((X_k.real * X_k.real) + (X_k.img * X_k.img));
        phase = atan2(X_k.img, X_k.real);
        X.push({real: X_k.real, img: X_k.img, radius, freq, phase});
    };
    return X;
}
