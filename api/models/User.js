const express = require('express');

class User {
    static #name;
    static #username;

    __constructor(name) {
        this.name = name;
        this.username = name.toLowerCase().replace(/\s+/g, '');
    }

}