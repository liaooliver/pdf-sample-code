const express = require('express')
const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { writeFileSync, readFileSync } = require("fs");

var cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.get('/', async (req, res) => {

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400,400]);
    page.moveTo(110, 200);
    page.drawText('Hello World!');
    
    const filename = 'blank.pdf'
    writeFileSync(filename, await pdfDoc.save())

    res.download(`./${filename}`);
})

app.get('/modifyAnExistingPDF', async (req, res) => {
    const document = await PDFDocument.load(readFileSync('./with_update_sections.pdf')); 

    const courierBoldFont = await document.embedFont(StandardFonts.Courier);

    const form = document.getForm()
    const fields = form.getFields()
    fields.forEach(field => {
        const type = field.constructor.name
        const name = field.getName()
        console.log(`${type}: ${name}`)
    })
    const ssn = form.getTextField('SSN')
    const AMT = form.getTextField('AMT')
    const SSSN = form.getTextField('SSSN')
    const NAME = form.getTextField('NAME')
    const SPNAME = form.getTextField('SPNAME')
    const ADDR = form.getTextField('ADDR')
    const APT = form.getTextField('APT')
    const CSZ = form.getTextField('CSZ')
    

    ssn.setText('0000000000')


    const pages = document.getPages()
    const firstPage = pages[0]

    const { width, height } = firstPage.getSize()
    firstPage.drawText('This text was added with JavaScript!', {
        x: width / 8,
        y: height / 2 + 200,
        size: 30,
        font: courierBoldFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
        opacity: 0.3
    })
    const filename = 'ModifyPDF.pdf';
    const pdfBytes = await document.save();

    writeFileSync(filename, pdfBytes)
    res.download(`./${filename}`);
})

app.get('/downloadPDFbase64',async (req, res) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([350, 400]);
    page.moveTo(110, 200);
    page.drawText('Hello World!');
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    res.json({
        base64: pdfDataUri
    })
})

app.get('/fillForm', async (req, res) => {
    const document = await PDFDocument.load(readFileSync('./dod_character.pdf'));
    const form = document.getForm()
    console.log(form)

    const fields = form.getFields()
    fields.forEach(field => {
        const type = field.constructor.name
        const name = field.getName()
        console.log(`${type}: ${name}`)
    })

    res.json('success')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})