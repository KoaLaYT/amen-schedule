import CryptoJS from "crypto-js";

const cases = [
    { input: "some input", expected: 32 },
    { input: "other input", expected: 32 },
];

test("md5", async () => {
    for (const { input, expected } of cases) {
        const result = CryptoJS.MD5(input).toString();
        expect(result.length).toEqual(expected);
        console.log(input, result);
    }
});
