import QRCode from 'qrcode';

const generateStudentQR = async (rollno) => {
    try {
        // Generates QR code with the URL pattern for student scan
        const qrCodeDataURL = await QRCode.toDataURL(`https://yourdomain.com/scan/student/${rollno}`);
        return qrCodeDataURL;
    } catch (error) {
        throw new Error("Error generating student QR code");
    }
};

const generateMealTokenQR = async (tokenID) => {
    try {
        // Generates QR code with the URL pattern for meal token validation
        const qrCodeDataURL = await QRCode.toDataURL(`https://yourdomain.com/scan/token/${tokenID}`);
        return qrCodeDataURL;
    } catch (error) {
        throw new Error("Error generating meal token QR code");
    }
};


export {
    generateStudentQR,
    generateMealTokenQR,
};