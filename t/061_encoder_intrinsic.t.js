StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS', 'KiokuJS.Backend.Hash', 'KiokuJS.Test.Person' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,               "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,     "'KiokuJS.Collapser' is here")
        t.ok(KiokuJS.Test.Person,   "'KiokuJS.Test.Person' is here")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        var Homer = new KiokuJS.Test.Person({
            name    : 'Homer Simpson'
        })
        
        var Marge = new KiokuJS.Test.Person({
            name    : 'Marge Simpson'
        })
        
        var Bart = new KiokuJS.Test.Person({
            name    : 'Bart Simpson'
        })
        
        var Lisa = new KiokuJS.Test.Person({
            name    : 'Lisa Simpson'
        })
        
        
        Homer.spouse(Marge)
        Marge.spouse(Homer)
        
        Bart.farther    = Lisa.farther  = Homer
        Bart.mother     = Lisa.mother   = Marge
        
        var kids = [ Bart, Lisa ]
        
        Homer.children = Marge.children = kids
        

        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash({
            resolver            : new KiokuJS.Resolver.Standard()
        })
        
        var collapser = new KiokuJS.Collapser({
            scope               : new KiokuJS.Scope({
                backend     : backend
            })
        })
        
        t.ok(collapser, "KiokuJS collapser was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking entries')
        
        var entry       = homerNode.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == homerNode.ID, 'Entry has correct ID')
        t.ok(entry.className == 'KiokuJS.Test.Person', 'Entry has correct `className`')
        
        t.ok(data.name == 'Homer Simpson', 'Entry has correct name')
        t.ok(data.spouse == margeNode, 'Entry has correct `spouse` ref')
        t.ok(data.children.$ref == kidsNode1.ID, 'Entry has correct `children` ref')
        
        
        var entry       = margeNode.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == margeNode.ID, 'Entry has correct ID')
        t.ok(entry.className == 'KiokuJS.Test.Person', 'Entry has correct `className`')
        
        t.ok(data.name == 'Marge Simpson', 'Entry has correct name')
        t.ok(data.spouse.$ref == homerNode.ID, 'Entry has correct `spouse` ref')
        t.ok(data.children.$ref == kidsNode1.ID, 'Entry has correct `children` ref')
        

        var entry       = kidsNode1.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == kidsNode1.ID, 'Entry has correct ID')
        t.ok(entry.className == 'Array', 'Entry has correct `className`')
        
        t.ok(data[0].$ref == bartNode.ID, 'Entry has correct first element')
        t.ok(data[1].$ref == lisaNode.ID, 'Entry has correct second element')
        
        
        var entry       = bartNode.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == bartNode.ID, 'Entry has correct ID')
        t.ok(entry.className == 'KiokuJS.Test.Person', 'Entry has correct `className`')
        
        t.ok(data.farther.$ref == homerNode.ID, 'Entry has correct `farther` ref')
        t.ok(data.mother.$ref == margeNode.ID, 'Entry has correct `mother` ref')

        
        var entry       = lisaNode.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == lisaNode.ID, 'Entry has correct ID')
        t.ok(entry.className == 'KiokuJS.Test.Person', 'Entry has correct `className`')
        
        t.ok(data.farther.$ref == homerNode.ID, 'Entry has correct `farther` ref')
        t.ok(data.mother.$ref == margeNode.ID, 'Entry has correct `mother` ref')
        
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapsing with intrinsic entries, repeating collapsing')
        
        Homer.children = [ Bart, Lisa ]
        Marge.children = [ Bart, Lisa ]
        
        
        var collapser = new KiokuJS.Collapser({
            scope               : new KiokuJS.Scope({
                backend     : backend
            })
        })
        
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking entries')
        
        var entry       = homerNode.getEntry()
        var data        = entry.data
        
        
        t.ok(data.children.className == 'Array', 'Entry has correct intrinsic `children` entry')
        
        t.ok(data.children.data[0].$ref == bartNode.ID, 'Entry has correct ref to Bart node')
        t.ok(data.children.data[1].$ref == lisaNode.ID, 'Entry has correct ref to Lisa node')
        

        var entry       = margeNode.getEntry()
        var data        = entry.data
        
        
        t.ok(data.children.className == 'Array', 'Entry has correct intrinsic `children` entry')
        
        t.ok(data.children.data[0].$ref == bartNode.ID, 'Entry has correct ref to Bart node')
        t.ok(data.children.data[1].$ref == lisaNode.ID, 'Entry has correct ref to Lisa node')
        
        t.done()
        
        t.endAsync(async0)
        
        
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        
        var value = new KiokuJS.Test.ValueWrapper({ value : 'someValue' })
        
        var array = [ value, value ]
        
        var graph = {
            data1 : value,
            data2 : array
        }
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash({
            resolver            : new KiokuJS.Resolver.Standard([
                {
                    meta : 'KiokuJS.Test.TypeMap.ValueWrapper'
                }
            ])
        })
        
        var collapser = new KiokuJS.Collapser({
            scope               : new KiokuJS.Scope({
                backend     : backend
            })
        })
        
        
        t.ok(collapser, "KiokuJS collapser was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ graph, array ])
        
        t.ok(nodes.length == 2, 'Correct number of nodes is returned')
        
        
        var graphNode   = nodes[0]
        var arrayNode   = nodes[1]

        t.ok(graphNode.object === graph, '`graphNode` has correct object')
        t.ok(arrayNode.object === array, '`arrayNode` has correct object')
        
        t.ok(graphNode.isRoot, '`graphNode` is in the root objects set')
        t.ok(arrayNode.isRoot, '`arrayNode` is in the root objects set')
        
        
        var valueNode1   = graphNode.data.data1
        var valueNode2   = arrayNode.data[0]
        var valueNode3   = arrayNode.data[1]
        
        t.ok(valueNode1 === valueNode2 && valueNode2 === valueNode3, 'All three value nodes are shared')
        
        t.ok(!valueNode1.isFirstClass(), '`valueNode1` is not first class')
        
        
        
        
        
        
        Class('Some.Class', {
            
            has : {
                $ref    : null,
                $entry  : null
            }
        })

        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        var instance = new Some.Class()
        
        instance.$ref   = instance
        instance.$entry = '123'
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapsing')

        var collapser = new KiokuJS.Collapser({
            resolver            : new KiokuJS.Resolver.Standard(),
            backend             : new KiokuJS.Backend.Hash()
        })
        
        
        var nodes = collapser.collapse({}, [ instance ])
        
        t.ok(nodes.length == 1, 'Correct number of nodes was returned')
        
        var node   = nodes[0]

        t.ok(node.object === instance, '`node` has correct object')
        t.ok(node.isRoot, '`node` is in the root objects set')
        
        
        var refNode   = node.data.$ref
        
        t.ok(refNode === node, 'Self-referencing node was collapsed correctly')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking entries')
        
        var entry       = node.getEntry()
        var entryData   = entry.data
        
        t.ok(entry.ID == node.ID, "Node's entry has correct ID")
        
        t.ok(entryData['public:$ref'].$ref == node.ID, 'Self-reference was correctly serialized')
        t.ok(entryData['public:$entry'] == '123', 'Entry with name `$entry` was correctly serialized')
        
        
    })
})    