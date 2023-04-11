export const json = async (req, res) => {

    const buf = [];

    for await (const chunk of req) {
        buf.push(Buffer.from(chunk));
    }

    try {
        req.body = JSON.parse(Buffer.concat(buf).toString());
    } catch (error) {
        req.body = {};
    }

    res.setHeader('Content-type', 'Application/json');

}