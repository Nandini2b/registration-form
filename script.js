const form = document.getElementById("registrationForm");

const message = document.getElementById("message");

const submitBtn = document.getElementById("submitBtn");


/*
=========================================
PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL
=========================================
*/

const scriptURL =
    "https://script.google.com/macros/library/d/1MkPE-aSPFfKzs1Axe4-c-Ums9slPK_lfPeo-6tF0ZYyjBNtt5zY8zsh0/3";


/*
=========================================
SUBJECT LISTS
=========================================
*/

const scienceSubjects = [
    "B.Sc. Chemistry",
    "B.Sc. Biochemistry",
    "B.Sc. Biotechnology",
    "B.Sc. Botany",
    "B.Sc. Zoology",
    "B.Sc. Physics",
    "B.Sc. Mathematics",
    "B.Sc. Electronics",
    "B.Sc. Computer Science"
];


const artsSubjects = [
    "Political Science",
    "History",
    "Geography",
    "Economics",
    "Sociology",
    "Psychology",
    "English / Hindi / Marathi",
    "Philosophy"
];


let currentSubjects = [];


/*
=========================================
ELEMENTS
=========================================
*/

const stream = document.getElementById("stream");

const subjectSection =
    document.getElementById("subjectSection");

const dsc1 =
    document.getElementById("dsc1");

const dsc2 =
    document.getElementById("dsc2");

const dsc3 =
    document.getElementById("dsc3");

const photoInput =
    document.getElementById("photo");


/*
=========================================
STREAM CHANGE
=========================================
*/

stream.addEventListener("change", function () {

    if (stream.value === "Science") {

        currentSubjects = scienceSubjects;

        subjectSection.classList.remove("hidden");

        initSubjects();

    }

    else if (stream.value === "Arts") {

        currentSubjects = artsSubjects;

        subjectSection.classList.remove("hidden");

        initSubjects();

    }

    else {

        subjectSection.classList.add("hidden");

        currentSubjects = [];

        dsc1.innerHTML = "";
        dsc2.innerHTML = "";
        dsc3.innerHTML = "";
    }

});


/*
=========================================
INITIALIZE SUBJECT DROPDOWNS
=========================================
*/

function initSubjects() {

    [dsc1, dsc2, dsc3].forEach(
        (select, index) => {

            select.innerHTML = "";

            addOption(
                select,
                "",
                `-- Select Subject ${index + 1} --`
            );

            currentSubjects.forEach(subject => {

                addOption(
                    select,
                    subject,
                    subject
                );

            });

        }
    );
}


function addOption(
    select,
    value,
    text
) {

    const option =
        document.createElement("option");

    option.value = value;

    option.textContent = text;

    select.appendChild(option);
}


/*
=========================================
PREVENT DUPLICATE SUBJECTS
=========================================
*/

function updateSubjects() {

    const values = [
        dsc1.value,
        dsc2.value,
        dsc3.value
    ];

    rebuildDropdown(
        dsc1,
        values[0],
        [values[1], values[2]],
        1
    );

    rebuildDropdown(
        dsc2,
        values[1],
        [values[0], values[2]],
        2
    );

    rebuildDropdown(
        dsc3,
        values[2],
        [values[0], values[1]],
        3
    );
}


function rebuildDropdown(
    select,
    current,
    exclude,
    index
) {

    select.innerHTML = "";

    addOption(
        select,
        "",
        `-- Select Subject ${index} --`
    );

    currentSubjects.forEach(subject => {

        if (!exclude.includes(subject)) {

            addOption(
                select,
                subject,
                subject
            );

        }

    });

    select.value = current;
}


[dsc1, dsc2, dsc3].forEach(
    select => {

        select.addEventListener(
            "change",
            updateSubjects
        );

    }
);


/*
=========================================
VALIDATION
=========================================
*/

const validators = {

    name: value =>
        value.trim().length >= 2 ||
        "Enter your full name",

    email: value =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        "Enter a valid email",

    mobile: value =>
        /^[6-9]\d{9}$/.test(value) ||
        "Enter a valid 10-digit mobile",

    rollNo: value =>
        value.trim().length >= 1 ||
        "Enter your roll number",

    apaar: value =>
        /^\d{12}$/.test(value) ||
        "APAAR ID must be 12 digits",

    dob: value => {

        if (!value) {

            return "Select your date of birth";
        }

        const date =
            new Date(value);

        const minDate =
            new Date("1980-01-01");

        const maxDate =
            new Date();

        if (
            date < minDate ||
            date > maxDate
        ) {

            return "DOB must be between 1980 and today";
        }

        return true;
    },

    aadhaar: value =>
        /^\d{12}$/.test(value) ||
        "Aadhaar must be 12 digits",

    stream: value =>
        value !== "" ||
        "Select a stream",

    nomineeName: value =>
        value.trim().length >= 2 ||
        "Enter nominee name",

    nomineeDob: value =>
        value !== "" ||
        "Select nominee DOB",

    nomineeMobile: value =>
        /^[6-9]\d{9}$/.test(value) ||
        "Enter valid 10-digit mobile",

    nomineeAadhaar: value =>
        /^\d{12}$/.test(value) ||
        "Aadhaar must be 12 digits"

};


/*
=========================================
SHOW ERROR
=========================================
*/

function showError(
    fieldName,
    errorMessage
) {

    const errorElement =
        document.querySelector(
            `.err[data-for="${fieldName}"]`
        );

    const input =
        document.getElementById(fieldName);


    if (errorElement) {

        errorElement.textContent =
            errorMessage || "";

    }


    if (input) {

        input.classList.toggle(
            "invalid",
            !!errorMessage
        );

    }

}


/*
=========================================
VALIDATE FIELD
=========================================
*/

function validateField(
    name,
    value
) {

    const rule =
        validators[name];


    if (!rule) {

        return true;
    }


    const result =
        rule(value);


    if (result === true) {

        showError(name, "");

        return true;
    }


    showError(
        name,
        result
    );

    return false;
}


/*
=========================================
LIVE VALIDATION
=========================================
*/

Object.keys(validators).forEach(
    name => {

        const element =
            document.getElementById(name);


        if (element) {

            element.addEventListener(
                "blur",
                () => {

                    validateField(
                        name,
                        element.value
                    );

                }
            );

        }

    }
);


/*
=========================================
DIGIT-ONLY FIELDS
=========================================
*/

[
    "mobile",
    "aadhaar",
    "apaar",
    "nomineeMobile",
    "nomineeAadhaar"
].forEach(id => {

    const element =
        document.getElementById(id);


    if (!element) {

        return;
    }


    element.addEventListener(
        "input",
        () => {

            element.value =
                element.value.replace(
                    /\D/g,
                    ""
                );

        }
    );

});


/*
=========================================
PHOTO COMPRESSION
=========================================
*/

async function compressImage(
    file,
    maxSizeBytes = 1024 * 1024
) {

    return new Promise(
        (resolve, reject) => {

            if (!file.type.startsWith("image/")) {

                reject(
                    new Error("Not an image")
                );

                return;
            }


            const image =
                new Image();

            const reader =
                new FileReader();


            reader.onload = event => {

                image.src =
                    event.target.result;

            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Failed to read file"
                    )
                );

            };


            image.onload = () => {

                const canvas =
                    document.createElement(
                        "canvas"
                    );


                let width =
                    image.width;

                let height =
                    image.height;


                const maxDimension = 1200;


                if (
                    width > maxDimension ||
                    height > maxDimension
                ) {

                    const scale =
                        Math.min(
                            maxDimension / width,
                            maxDimension / height
                        );

                    width =
                        Math.round(
                            width * scale
                        );

                    height =
                        Math.round(
                            height * scale
                        );
                }


                canvas.width =
                    width;

                canvas.height =
                    height;


                const context =
                    canvas.getContext("2d");


                context.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );


                let quality = 0.9;


                function tryCompress() {

                    const dataUrl =
                        canvas.toDataURL(
                            "image/jpeg",
                            quality
                        );


                    const base64Length =
                        dataUrl.length -
                        "data:image/jpeg;base64,"
                            .length;


                    const sizeBytes =
                        Math.ceil(
                            base64Length * 3 / 4
                        );


                    if (
                        sizeBytes <=
                            maxSizeBytes ||
                        quality <= 0.3
                    ) {

                        resolve({
                            dataUrl,
                            sizeBytes
                        });

                        return;
                    }


                    quality -= 0.1;

                    tryCompress();
                }


                tryCompress();
            };


            image.onerror = () => {

                reject(
                    new Error(
                        "Invalid image file"
                    )
                );

            };


            reader.readAsDataURL(file);
        }
    );
}


/*
=========================================
FULL VALIDATION
=========================================
*/

function validateAll() {

    let valid = true;


    const formData =
        new FormData(form);


    for (
        const fieldName of
        Object.keys(validators)
    ) {

        const value =
            formData.get(fieldName) || "";


        if (
            !validateField(
                fieldName,
                value
            )
        ) {

            valid = false;

        }

    }


    /*
    Subject validation
    */

    if (
        stream.value === "Science" ||
        stream.value === "Arts"
    ) {

        const subjects = [
            dsc1.value,
            dsc2.value,
            dsc3.value
        ];


        const subjectError =
            document.querySelector(
                '.err[data-for="subjects"]'
            );


        if (
            subjects.some(
                subject => !subject
            )
        ) {

            if (subjectError) {

                subjectError.textContent =
                    "Select all three subjects";
            }

            valid = false;

        }

        else if (
            new Set(subjects).size !== 3
        ) {

            if (subjectError) {

                subjectError.textContent =
                    "Subjects must be unique";
            }

            valid = false;

        }

        else {

            if (subjectError) {

                subjectError.textContent =
                    "";
            }

        }

    }


    /*
    Photo validation
    */

    const photo =
        photoInput.files[0];


    if (!photo) {

        showError(
            "photo",
            "Please upload a photo"
        );

        valid = false;

    }

    else if (
        !photo.type.startsWith("image/")
    ) {

        showError(
            "photo",
            "File must be an image"
        );

        valid = false;

    }

    else {

        showError(
            "photo",
            ""
        );

    }


    return valid;
}


/*
=========================================
SUBMIT FORM
=========================================
*/

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        message.textContent = "";

        message.style.color = "";


        /*
        Check URL
        */

        if (
            !scriptURL ||
            scriptURL.includes(
                "PASTE_YOUR"
            )
        ) {

            message.textContent =
                "Apps Script URL is not configured.";

            message.style.color =
                "#ff6b70";

            return;
        }


        /*
        Validation
        */

        if (!validateAll()) {

            message.textContent =
                "Please fix the errors above.";

            message.style.color =
                "#ff6b70";

            return;
        }


        submitBtn.disabled = true;

        submitBtn.textContent =
            "Submitting...";


        message.textContent =
            "Compressing photo...";

        message.style.color =
            "#8b93a7";


        try {

            /*
            Get photo
            */

            const file =
                photoInput.files[0];


            /*
            Compress photo
            */

            const {
                dataUrl,
                sizeBytes
            } =
                await compressImage(
                    file,
                    1024 * 1024
                );


            console.log(
                "Compressed photo:",
                (sizeBytes / 1024).toFixed(1),
                "KB"
            );


            /*
            Create FormData
            */

            const formData =
                new FormData(form);


            /*
            Remove actual file
            */

            formData.delete("photo");


            /*
            Add Base64 photo
            */

            formData.append(
                "photoBase64",
                dataUrl
            );


            formData.append(
                "photoName",
                file.name
            );


            formData.append(
                "photoType",
                "image/jpeg"
            );


            message.textContent =
                "Submitting...";


            /*
            Send data
            */

            await fetch(
                scriptURL,
                {
                    method: "POST",
                    mode: "no-cors",
                    body: formData
                }
            );


            /*
            Success
            */

            message.textContent =
                "Registration submitted successfully!";

            message.style.color =
                "#3ddc84";


            /*
            Reset form
            */

            form.reset();


            subjectSection.classList.add(
                "hidden"
            );


            currentSubjects = [];


            dsc1.innerHTML = "";
            dsc2.innerHTML = "";
            dsc3.innerHTML = "";


            document
                .querySelectorAll(".err")
                .forEach(element => {

                    element.textContent = "";

                });


            document
                .querySelectorAll(".invalid")
                .forEach(element => {

                    element.classList.remove(
                        "invalid"
                    );

                });

        }


        catch (error) {

            console.error(
                "Submission failed:",
                error
            );


            message.textContent =
                "Submission failed. Please try again.";

            message.style.color =
                "#ff6b70";

        }


        finally {

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "Submit Registration";

        }

    }
);