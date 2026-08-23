function doGet() {

    return ContentService.createTextOutput(
        "SFS College Registration System is running!"
    );

}


function doPost(e) {

    try {

        const sheet =
            SpreadsheetApp
                .getActiveSpreadsheet()
                .getActiveSheet();


        /* ==========================================
           READ JSON DATA
        ========================================== */

        const data =
            JSON.parse(e.postData.contents);


        /* ==========================================
           PHOTO UPLOAD
        ========================================== */

        let photoURL = "";


        if (
            data.photoBase64 &&
            data.photoBase64 !== ""
        ) {

            /*
             * Remove the
             * data:image/...;base64,
             * part.
             */

            const base64Data =
                data.photoBase64.split(",")[1];


            const decoded =
                Utilities.base64Decode(
                    base64Data
                );


            /*
             * Create image blob.
             */

            const blob =
                Utilities.newBlob(
                    decoded,
                    data.photoType ||
                        "image/jpeg",
                    data.photoName ||
                        "student_photo.jpg"
                );


            /*
             * Find or create folder.
             */

            const folders =
                DriveApp.getFoldersByName(
                    "SFS Student Photos"
                );


            let folder;


            if (folders.hasNext()) {

                folder =
                    folders.next();

            } else {

                folder =
                    DriveApp.createFolder(
                        "SFS Student Photos"
                    );

            }


            /*
             * Save photo.
             */

            const file =
                folder.createFile(blob);


            /*
             * Get Drive link.
             */

            photoURL =
                file.getUrl();

        }


        /* ==========================================
           STORE DATA IN GOOGLE SHEET
        ========================================== */

        sheet.appendRow([

            new Date(),

            data.name,

            data.email,

            data.mobile,

            data.apaar,

            data.dob,

            data.aadhaar,

            data.stream,

            data.dsc1,

            data.dsc2,

            data.dsc3,

            data.nomineeName,

            data.nomineeDob,

            data.nomineeMobile,

            data.nomineeAadhaar,

            photoURL

        ]);


        /* ==========================================
           SUCCESS
        ========================================== */

        return ContentService.createTextOutput(
            "Registration successful!"
        );


    } catch (error) {

        return ContentService.createTextOutput(
            "Error: " + error.message
        );

    }

}
