async function fingerprintId() {
    try {
        const FingerprintJS = await import('https://openfpcdn.io/fingerprintjs/v4');
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceId = result.visitorId;
    } catch (error) {
        console.log(error);
        deviceId = crypto.randomUUID()

    }
    return deviceId
}