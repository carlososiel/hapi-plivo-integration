# Hapi Plivo plugin
Is a plugin to integrate the features of communication platform Plivo with HapiJS.

## Installation 
`npm install @samsystems/hapi-plivo`

## Basic Setup
To run correctly, this plugin require some options, like credentials to connect with Plivo, and a default number to use. The basic options that need are:

    authId: Can be found in Plivo dashboard and represent the identifier of credentials
    authToken: Can be found too in Plivo dashboard and it hide by default.
    from: The default number to use when make calls and send sms.
    
An example of config can be something like that:

``` 
    plugin:  {
    
        register: '@samsystems/hapi-plivo',                
        options: {
            authId: 'valid Auth ID',
            authToken: 'valid Auth token',
            from: 'valid phone number buy in Plivo',
        }
    }
```
    