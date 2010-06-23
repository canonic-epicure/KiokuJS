Role('KiokuJS.Role.UUID.Serial', {

    use : 'KiokuJS.Role.UUID',
    

body : function () {
    
    var uuid        = 0
    var nulls       = '000000'

    this.meta.extend({
        
        does : KiokuJS.Role.UUID,
        
        
        methods : {
            
            generateUUID   : function () {
                var id  = uuid++ + ''
                
                return nulls.substr(0, nulls.length - id.length) + id
            }
        }
    
    })
    
}})

