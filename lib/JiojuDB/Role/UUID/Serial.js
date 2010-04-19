Role('JiojuDB.Role.UUID.Serial', {

    use : 'JiojuDB.Role.UUID',
    

body : function () {
    
    var uuid        = 0
    var nulls       = '000000'

    this.meta.extend({
        
        does : JiojuDB.Role.UUID,
        
        
        methods : {
            
            generateUUID   : function () {
                var id  = uuid++ + ''
                
                return nulls.substr(0, nulls.length - id.length) + id
            }
        }
    
    })
    
}})

