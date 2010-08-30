Class('KiokuJS.Serializer.JSON', {
    
    does        : 'KiokuJS.Role.Serializer',
    
    use         : [ 'JSON2', 'KiokuJS.Exception.Format' ],
    
    my : {
        
        methods : {
            
            serialize   : function (data) {
                return JSON2.stringify(data)
            },
            
            
            deserialize : function (string) {
                try {
                    return JSON2.parse(string)
                } catch (e) {
                    
                    throw new KiokuJS.Exception.Format({ message : 'Invalid JSON: ' + string })
                }
            }
        } 
    }
})
